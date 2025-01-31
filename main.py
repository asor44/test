import streamlit as st
import database
from models import User
import hashlib
from pathlib import Path
import base64

# Configuration de la page
st.set_page_config(
    page_title="Cadets de la défense de Nantes",
    page_icon="🏠",
    layout="wide"
)

# Charger le CSS personnalisé
def load_css():
    css_file = Path("static/style.css").read_text()
    st.markdown(f'<style>{css_file}</style>', unsafe_allow_html=True)

# Function to load and encode the image
def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode()

# Charger le footer
def load_footer():
    # Get the encoded image
    encoded_logo = get_base64_encoded_image("attached_assets/orion_logo.png")
    footer_html = f'''
    <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #f0f2f6; padding: 0.3rem; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
            <img src="data:image/png;base64,{encoded_logo}" alt="Orion Solutions Group" style="max-width: 40px; margin: 0 auto 0.1rem auto; display: block;">
            <p style="font-size: 0.7rem; color: #666; margin: 0;">Créé par Orion Solutions Group</p>
        </div>
    </div>
    '''
    st.markdown(footer_html, unsafe_allow_html=True)

# Initialize session state
if 'user' not in st.session_state:
    st.session_state.user = None
if 'authentication_status' not in st.session_state:
    st.session_state.authentication_status = None

# Initialize database
database.init_db()

# Charger le CSS
load_css()

def check_authentication():
    if not st.session_state.user:
        st.session_state.authentication_status = False
        st.stop()
    return True

def login():
    # Masquer le menu latéral sur la page de connexion
    st.markdown("""
        <style>
        #MainMenu {visibility: hidden;}
        section[data-testid="stSidebar"] {display: none;}
        </style>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns([1.5, 1, 1.5])
    with col2:
        st.image("attached_assets/téléchargement (1).jpg", width=60, use_container_width=True)

    st.markdown('<h1 style="text-align: center; margin-top: 1rem;">Cadets de la défense de Nantes</h1>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        with st.form("login_form", clear_on_submit=False):
            st.markdown('<div class="login-form">', unsafe_allow_html=True)
            email = st.text_input("📧 Email", placeholder="Entrez votre email")
            password = st.text_input("🔑 Mot de passe", type="password", placeholder="Entrez votre mot de passe")
            submitted = st.form_submit_button("Se connecter", use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

            if submitted:
                user = User.get_by_email(email)
                if user and user.verify_password(password):
                    st.session_state.user = user
                    st.session_state.authentication_status = True
                    st.success("Connexion réussie!")
                    st.rerun()
                else:
                    st.error("Email ou mot de passe incorrect")

def main_page():
    # Vérifier l'authentification
    if not check_authentication():
        return

    col1, col2, col3 = st.columns([1.5, 1, 1.5])
    with col2:
        st.markdown('<div class="main-header">', unsafe_allow_html=True)
        st.image("attached_assets/téléchargement (1).jpg", width=60, use_container_width=True)
        st.markdown(f'<h1>Bienvenue, {st.session_state.user.name}</h1></div>', unsafe_allow_html=True)

    st.markdown("""
    ### Menu Principal

    Utilisez la barre latérale pour accéder aux différentes fonctionnalités :

    - 📋 Gestion des présences
    - 🎯 Activités
    - 📦 Stocks et équipements
    - 💬 Messages
    - 📊 Rapports
    """)

    if st.button("Se déconnecter"):
        st.session_state.user = None
        st.session_state.authentication_status = False
        st.rerun()

def main():
    if not st.session_state.authentication_status:
        login()
    else:
        main_page()

    # Ajouter le footer
    load_footer()

if __name__ == "__main__":
    main()