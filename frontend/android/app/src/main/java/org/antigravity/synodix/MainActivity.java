package org.antigravity.synodix;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.clearCache(true);
            WebSettings settings = webView.getSettings();
            if (settings != null) {
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            }
        }
    }
}
