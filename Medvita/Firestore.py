import export
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials

cred = credentials.Certificate("MedTech.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

doc_ref = db.collection('Temperature').document('TempData')

doc_ref.set({

'Temperature': 23.7

})