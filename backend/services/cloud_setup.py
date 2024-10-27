# Method 1: Using service account key file
from google.oauth2 import service_account
from google.cloud import storage

def setup_gcp_credentials(key_path):
    """
    Set up Google Cloud credentials using a service account key file
    
    Args:
        key_path (str): Path to service account JSON key file
    Returns:
        credentials object that can be used with GCP clients
    """
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    return credentials

# Example usage with storage client
def create_storage_client(key_path):
    credentials = setup_gcp_credentials(key_path)
    client = storage.Client(credentials=credentials)
    return client

# Method 2: Using environment variable
import os

def setup_gcp_credentials_env():
    """
    Set up Google Cloud credentials using environment variable
    Must be run before using any Google Cloud clients
    """
    # Set the environment variable to point to your service account key file
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/backend/services/mediverse-439815-7baac22ee641.json'
    
    # After this, Google Cloud clients will automatically use these credentials
    # Example:
    # storage_client = storage.Client()