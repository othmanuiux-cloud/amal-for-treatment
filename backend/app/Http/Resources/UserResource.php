<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'country' => $this->country,
            'phone' => $this->when(
                $request->user() && ($request->user()->isAdmin() || $request->user()->id === $this->id),
                $this->getDecryptedPhone()
            ),
            'phone_masked' => $this->getMaskedPhone(),
            'avatar_url' => $this->avatar_path ? asset('storage/' . $this->avatar_path) : null,
            'is_active' => $this->is_active,
            'email_verified' => !is_null($this->email_verified_at),
            'created_at' => $this->created_at->toISOString(),
        ];
    }

    protected function getMaskedPhone(): ?string
    {
        $phone = $this->getDecryptedPhone();
        if (!$phone) {
            return null;
        }
        
        $length = strlen($phone);
        if ($length <= 4) {
            return $phone;
        }
        
        return substr($phone, 0, 2) . str_repeat('*', $length - 4) . substr($phone, -2);
    }
}
