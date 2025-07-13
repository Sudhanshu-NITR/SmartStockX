from django.apps import AppConfig
import threading
import time
import requests

class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inventory'

class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inventory'

    def ready(self):
        def ping_self():
            while True:
                try:
                    print("Pinging self to stay alive...")
                    requests.get("https://smartstockx-backend.onrender.com/ping/")
                except Exception as e:
                    print(f"Ping failed: {e}")
                time.sleep(14 * 60)  # 14 minutes in seconds

        threading.Thread(target=ping_self, daemon=True).start()
