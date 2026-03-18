<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseDocument;
use App\Models\MedicalCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function upload(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:5120'],
            'file_type' => ['required', 'in:medical_report,prescription,lab_result,imaging,id_proof,other'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        $folder = 'documents/' . $medicalCase->id . '/' . date('Y/m');
        $fileName = Str::uuid() . '.' . $extension;
        
        $path = $file->storeAs($folder, $fileName, 'private');

        $document = CaseDocument::create([
            'medical_case_id' => $medicalCase->id,
            'file_path' => $path,
            'file_disk' => 'private',
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'file_type' => $request->file_type,
            'file_size' => $size,
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => new \App\Http\Resources\DocumentResource($document),
        ], 201);
    }

    public function download(Request $request, CaseDocument $document): \Illuminate\Http\Response
    {
        $path = storage_path('app/' . $document->file_path);
        
        if (!file_exists($path)) {
            abort(404, 'File not found');
        }

        return response()->download($path, $document->original_name, [
            'Content-Type' => $document->mime_type,
        ]);
    }

    public function downloadSignedUrl(Request $request, CaseDocument $document): JsonResponse
    {
        $expires = now()->addHour();
        $url = Storage::disk($document->file_disk)->temporaryUrl(
            $document->file_path,
            $expires
        );

        return response()->json([
            'url' => $url,
            'expires_at' => $expires->toISOString(),
        ]);
    }

    public function destroy(Request $request, CaseDocument $document): JsonResponse
    {
        Storage::disk($document->file_disk)->delete($document->file_path);
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully',
        ]);
    }
}
