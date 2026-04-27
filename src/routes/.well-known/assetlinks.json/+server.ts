import { json } from "@sveltejs/kit";

// Android App Links — update package_name and sha256_cert_fingerprints before Play Store submission.
// Get the fingerprint via: keytool -list -v -keystore your-release-key.keystore
// https://developer.android.com/training/app-links/verify-android-applinks
export function GET() {
  return json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.duaspro.app",
        sha256_cert_fingerprints: [
          "TODO: Replace with your app's SHA-256 certificate fingerprint"
        ]
      }
    }
  ]);
}
