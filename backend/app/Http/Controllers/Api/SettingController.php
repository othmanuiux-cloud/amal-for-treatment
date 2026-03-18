<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $group = $request->query('group');
        $query = Setting::query();
        if ($group) {
            $query->where('group', $group);
        }
        return response()->json(['data' => $query->get()]);
    }

    public function update(Request $request)
    {
        \Log::info('Settings update request received', $request->all());
        
        $settings = $request->input('settings', []);
        
        \Log::info('Settings to update', $settings);
        
        foreach ($settings as $key => $value) {
            $setting = Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
            \Log::info("Setting saved: {$key} = {$value}", ['id' => $setting->id]);
        }
        
        // Verify the save
        $savedSettings = Setting::whereIn('key', array_keys($settings))->get();
        \Log::info('Verified saved settings:', $savedSettings->toArray());
        
        return response()->json([
            'message' => 'Settings updated successfully',
            'saved' => $savedSettings
        ]);
    }

    public function getByKey($key)
    {
        $setting = Setting::where('key', $key)->first();
        return response()->json(['data' => $setting]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $logo->getClientOriginalExtension();
            
            // Store in public disk under settings folder
            $path = $logo->storeAs('settings', $filename, 'public');
            
            // Save the URL to settings
            $url = asset('storage/' . $path);
            Setting::updateOrCreate(
                ['key' => 'site_logo'],
                ['value' => $url]
            );

            \Log::info('Logo uploaded:', ['path' => $path, 'url' => $url]);

            return response()->json([
                'success' => true,
                'url' => $url,
                'message' => 'Logo uploaded successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No logo file provided'
        ], 400);
    }
}
