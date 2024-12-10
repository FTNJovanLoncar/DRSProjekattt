
from korisnik import Korisnik
from config import db, app,api
from flask import request, session
from flask_restful import Resource
import time
import threading


def citanjeKorisnikaIzBaze():
    with app.app_context():
        korisniciIzBaze = Korisnik.query.all()
        return korisniciIzBaze
    

def dodavanjeKorisnikaUBazu(novi_korisnik):
    with app.app_context():
        korisnik_vec_postoji = Korisnik.query.filter_by(email=novi_korisnik.email).first()
        if korisnik_vec_postoji is None:
            db.session.add(novi_korisnik)
            db.session.commit()
        else:
            print(f"Korisnik sa email {novi_korisnik.email} već postoji u bazi !")

def nadjiKorisnikaPoEmailu(email):
    with app.app_context():
        korisnik = Korisnik.query.filter_by(email=email).first()

        if korisnik is not None:
            return korisnik
        else:
            print(f"Korisnik sa email {email} ne postoji u bazi !")
            return None