
import os
import threading
import time
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.garden.webview import WebView
from kivy.clock import Clock
from flask import Flask
import subprocess
import sys

# Import your Flask app
sys.path.append('AlBhedCipher')
from AlBhedCipher.app import app as flask_app

class WebViewApp(App):
    def build(self):
        # Start Flask server in a separate thread
        flask_thread = threading.Thread(target=self.start_flask_server, daemon=True)
        flask_thread.start()
        
        # Wait a moment for Flask to start
        time.sleep(2)
        
        # Create the main layout
        layout = BoxLayout(orientation='vertical')
        
        # Create webview and load the Flask app
        webview = WebView(url='http://127.0.0.1:5000')
        layout.add_widget(webview)
        
        return layout
    
    def start_flask_server(self):
        """Start the Flask server"""
        flask_app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    WebViewApp().run()
