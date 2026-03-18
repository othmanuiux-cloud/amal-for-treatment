<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['sometimes', 'nullable', 'in:patient,volunteer,admin'],
            'country' => ['required', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $phone = $request->input('phone');
        $phoneData = $this->encryptPhone($phone);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'patient',
            'country' => $data['country'],
            'phone_encrypted' => $phoneData['encrypted'] ?? null,
            'phone_iv' => $phoneData['iv'] ?? null,
            'is_active' => ($data['role'] ?? 'patient') === 'volunteer' ? false : true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => new \App\Http\Resources\UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (!$user->is_active) {
            $msg = $user->role === 'volunteer'
                ? 'حسابك كمتطوع قيد المراجعة حالياً من قبل الإدارة'
                : 'هذا الحساب معطل';
            return response()->json([
                'message' => $msg,
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => new \App\Http\Resources\UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new \App\Http\Resources\UserResource($request->user()),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'country' => ['sometimes', 'string', 'max:100'],
            'city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'available_for_cases' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->has('phone')) {
            $phoneData = $this->encryptPhone($request->phone);
            $data['phone_encrypted'] = $phoneData['encrypted'];
            $data['phone_iv'] = $phoneData['iv'];
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new \App\Http\Resources\UserResource($user),
        ]);
    }

    protected function encryptPhone(?string $phone): array
    {
        if (!$phone) {
            return ['encrypted' => null, 'iv' => null];
        }

        $cipher = 'aes-256-cbc';
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($phone, $cipher, config('app.key'), 0, $iv);

        return [
            'encrypted' => $encrypted,
            'iv' => base64_encode($iv),
        ];
    }
}
