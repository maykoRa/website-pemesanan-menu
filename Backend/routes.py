from flask import request, jsonify
from __init__ import app
from models import db, Pengguna, Kategori, Menu, Pesanan, DetailPesanan, Pembayaran
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
import traceback, imghdr, base64
from base64 import b64encode

# Registration Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    existing_user = Pengguna.query.filter((Pengguna.username == username) | (Pengguna.email == email)).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400

    new_pengguna = Pengguna(
        nama_pengguna=data['nama_pengguna'],
        username=data['username'],
        email=data['email'],
        kata_sandi=data['kata_sandi'], 
        peran='customer'
    )
    db.session.add(new_pengguna)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# User Routes
@app.route('/pengguna', methods=['POST'])
@jwt_required()
def add_pengguna():
    try:
        nama_pengguna = request.form.get('nama_pengguna')
        username = request.form.get('username')
        email = request.form.get('email')
        kata_sandi = request.form.get('kata_sandi')
        peran = request.form.get('peran')
        profile_picture = request.files.get('profile_picture') 

        if not all([nama_pengguna, username, email, kata_sandi, peran]):
            return jsonify({"message": "All fields are required"}), 400

        peran = peran.lower()

        if profile_picture:
            profile_picture_data = profile_picture.read()
        else:
            profile_picture_data = None

        new_pengguna = Pengguna(
            nama_pengguna=nama_pengguna,
            username=username,
            email=email,
            kata_sandi=kata_sandi,
            peran=peran,
            profile_picture=profile_picture_data
        )

        db.session.add(new_pengguna)
        db.session.commit()

        return jsonify({"message": "User added successfully"}), 201

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


@app.route('/pengguna', methods=['GET'])
@jwt_required()
def get_pengguna():
    pengguna_list = Pengguna.query.all()
    return jsonify([pengguna.to_dict() for pengguna in pengguna_list]), 200

@app.route('/pengguna/<int:pengguna_id>', methods=['PUT'])
@jwt_required()
def update_pengguna(pengguna_id):
    try:
        pengguna = Pengguna.query.get_or_404(pengguna_id)
        data = request.form

        pengguna.nama_pengguna = data.get('nama_pengguna', pengguna.nama_pengguna)
        pengguna.username = data.get('username', pengguna.username)
        pengguna.email = data.get('email', pengguna.email)
        pengguna.kata_sandi = data.get('kata_sandi', pengguna.kata_sandi)
        pengguna.peran = data.get('peran', pengguna.peran).lower()

        if 'profile_picture' in request.files:
            profile_picture = request.files['profile_picture']
            if profile_picture.filename != '':
                pengguna.profile_picture = profile_picture.read()
            else:
                pengguna.profile_picture = None

        db.session.commit()

        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


    
@app.route('/pengguna/<int:pengguna_id>', methods=['DELETE'])
@jwt_required()
def delete_pengguna(pengguna_id):
    pengguna = Pengguna.query.get_or_404(pengguna_id)
    db.session.delete(pengguna)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# Kategori Routes

@app.route('/kategori', methods=['POST'])
@jwt_required()
def add_kategori():
    data = request.get_json()
    new_kategori = Kategori(
        nama_kategori=data['nama_kategori'],
        deskripsi=data['deskripsi']
    )
    db.session.add(new_kategori)
    db.session.commit()
    return jsonify({"message": "Category added successfully"}), 201

@app.route('/kategori', methods=['GET'])
@jwt_required()
def get_kategori():
    kategori_list = Kategori.query.all()
    return jsonify([kategori.to_dict() for kategori in kategori_list]), 200

@app.route('/kategori/<int:kategori_id>', methods=['PUT'])
@jwt_required()
def update_kategori(kategori_id):
    kategori = Kategori.query.get_or_404(kategori_id)
    data = request.get_json()
    kategori.nama_kategori = data['nama_kategori']
    kategori.deskripsi = data['deskripsi']
    db.session.commit()
    return jsonify({"message": "Category updated successfully"}), 200

@app.route('/kategori/<int:kategori_id>', methods=['DELETE'])
@jwt_required()
def delete_kategori(kategori_id):
    kategori = Kategori.query.get_or_404(kategori_id)
    db.session.delete(kategori)
    db.session.commit()
    return jsonify({"message": "Category deleted successfully"}), 200

# Menu Routes

@app.route('/menu', methods=['POST'])
@jwt_required()
def add_menu():
    try:
        nama_menu = request.form.get('nama_menu')
        deskripsi = request.form.get('deskripsi')
        harga = request.form.get('harga')
        kategori_id = request.form.get('kategori_id')
        status = request.form.get('status')
        gambar = request.files['gambar'] 

        kategori_id = int(kategori_id) if kategori_id else None

        status_mapping = {
            'active': True,
            'inactive': False,
            'seasonal': False 
        }
        status = status_mapping.get(status.lower())

        if not all([nama_menu, deskripsi, harga, kategori_id, status is not None, gambar]):
            return jsonify({"message": "All fields are required"}), 400

        new_menu = Menu(
            nama_menu=nama_menu,
            deskripsi=deskripsi,
            harga=harga,
            kategori_id=kategori_id,
            gambar=gambar.read(),
            status=status
        )

        db.session.add(new_menu)
        db.session.commit()

        return jsonify({"message": "Menu added successfully"}), 201

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@app.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    menu_list = Menu.query.all()
    return jsonify([menu.to_dict() for menu in menu_list]), 200

@app.route('/menu/<int:menu_id>', methods=['PUT'])
@jwt_required()
def update_menu(menu_id):
    try:
        menu = Menu.query.get_or_404(menu_id)

        print(request.form)
        print(request.files)

        menu.nama_menu = request.form.get('nama_menu')
        menu.deskripsi = request.form.get('deskripsi')
        menu.harga = request.form.get('harga')
        menu.kategori_id = int(request.form.get('kategori_id')) if request.form.get('kategori_id') else None

        status_mapping = {
            'active': True,
            'inactive': False,
            'seasonal': False
        }
        menu.status = status_mapping.get(request.form.get('status').lower())

        if 'gambar' in request.files:
            file = request.files['gambar']
            menu.gambar = file.read()

        db.session.commit()

        return jsonify({"message": "Menu updated successfully"}), 200

    except Exception as e:
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@app.route('/menu/<int:menu_id>', methods=['DELETE'])
@jwt_required()
def delete_menu(menu_id):
    menu = Menu.query.get_or_404(menu_id)
    db.session.delete(menu)
    db.session.commit()
    return jsonify({"message": "Menu deleted successfully"}), 200

# Pesanan Routes

@app.route('/pesanan', methods=['POST'])
@jwt_required()
def add_pesanan():
    data = request.get_json()
    new_pesanan = Pesanan(
        id_pengguna=data['id_pengguna'],
        id_meja=data['id_meja'],
        tanggal_pesanan=data['tanggal_pesanan'],
        status_pesanan=data['status_pesanan'],
        total_harga=data['total_harga']
    )
    db.session.add(new_pesanan)
    db.session.commit()
    return jsonify({"message": "Order added successfully"}), 201

@app.route('/pesanan', methods=['GET'])
@jwt_required()
def get_pesanan():
    pesanan_list = Pesanan.query.all()
    return jsonify([pesanan.to_dict() for pesanan in pesanan_list]), 200

@app.route('/pesanan/<int:pesanan_id>', methods=['PUT'])
@jwt_required()
def update_pesanan(pesanan_id):
    pesanan = Pesanan.query.get_or_404(pesanan_id)
    data = request.get_json()
    pesanan.id_pengguna = data['id_pengguna']
    pesanan.id_meja = data['id_meja']
    pesanan.tanggal_pesanan = data['tanggal_pesanan']
    pesanan.status_pesanan = data['status_pesanan']
    pesanan.total_harga = data['total_harga']
    db.session.commit()
    return jsonify({"message": "Order updated successfully"}), 200

@app.route('/pesanan/<int:pesanan_id>', methods=['DELETE'])
@jwt_required()
def delete_pesanan(pesanan_id):
    pesanan = Pesanan.query.get_or_404(pesanan_id)
    db.session.delete(pesanan)
    db.session.commit()
    return jsonify({"message": "Order deleted successfully"}), 200

# DetailPesanan Routes

@app.route('/detail_pesanan', methods=['POST'])
@jwt_required()
def add_detail_pesanan():
    data = request.get_json()
    new_detail_pesanan = DetailPesanan(
        id_pesanan=data['id_pesanan'],
        id_menu=data['id_menu'],
        jumlah=data['jumlah'],
        subtotal=data['subtotal']
    )
    db.session.add(new_detail_pesanan)
    db.session.commit()
    return jsonify({"message": "Order detail added successfully"}), 201

@app.route('/detail_pesanan', methods=['GET'])
@jwt_required()
def get_detail_pesanan():
    detail_pesanan_list = DetailPesanan.query.all()
    return jsonify([detail_pesanan.to_dict() for detail_pesanan in detail_pesanan_list]), 200

@app.route('/detail_pesanan/<int:detail_pesanan_id>', methods=['PUT'])
@jwt_required()
def update_detail_pesanan(detail_pesanan_id):
    detail_pesanan = DetailPesanan.query.get_or_404(detail_pesanan_id)
    data = request.get_json()
    detail_pesanan.id_pesanan = data['id_pesanan']
    detail_pesanan.id_menu = data['id_menu']
    detail_pesanan.jumlah = data['jumlah']
    detail_pesanan.subtotal = data['subtotal']
    db.session.commit()
    return jsonify({"message": "Order detail updated successfully"}), 200

@app.route('/detail_pesanan/<int:detail_pesanan_id>', methods=['DELETE'])
@jwt_required()
def delete_detail_pesanan(detail_pesanan_id):
    detail_pesanan = DetailPesanan.query.get_or_404(detail_pesanan_id)
    db.session.delete(detail_pesanan)
    db.session.commit()
    return jsonify({"message": "Order detail deleted successfully"}), 200

# Pembayaran Routes

@app.route('/pembayaran', methods=['POST'])
@jwt_required()
def add_pembayaran():
    data = request.get_json()
    new_pembayaran = Pembayaran(
        id_pesanan=data['id_pesanan'],
        metode_pembayaran=data['metode_pembayaran'],
        tanggal_pembayaran=data['tanggal_pembayaran'],
        jumlah_bayar=data['jumlah_bayar'],
        kembalian=data['kembalian']
    )
    db.session.add(new_pembayaran)
    db.session.commit()
    return jsonify({"message": "Payment added successfully"}), 201

@app.route('/pembayaran', methods=['GET'])
@jwt_required()
def get_pembayaran():
    pembayaran_list = Pembayaran.query.all()
    return jsonify([pembayaran.to_dict() for pembayaran in pembayaran_list]), 200

@app.route('/pembayaran/<int:pembayaran_id>', methods=['PUT'])
@jwt_required()
def update_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get_or_404(pembayaran_id)
    data = request.get_json()
    pembayaran.id_pesanan = data['id_pesanan']
    pembayaran.metode_pembayaran = data['metode_pembayaran']
    pembayaran.tanggal_pembayaran = data['tanggal_pembayaran']
    pembayaran.jumlah_bayar = data['jumlah_bayar']
    pembayaran.kembalian = data['kembalian']
    db.session.commit()
    return jsonify({"message": "Payment updated successfully"}), 200

@app.route('/pembayaran/<int:pembayaran_id>', methods=['DELETE'])
@jwt_required()
def delete_pembayaran(pembayaran_id):
    pembayaran = Pembayaran.query.get_or_404(pembayaran_id)
    db.session.delete(pembayaran)
    db.session.commit()
    return jsonify({"message": "Payment deleted successfully"}), 200

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('kata_sandi')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = Pengguna.query.filter_by(email=email).first()

    if user and user.kata_sandi == password:
        # Generate JWT token
        access_token = create_access_token(identity=user.id_pengguna)
        return jsonify({"message": "Login successful", "access_token": access_token, "role": user.peran}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Admin Route
@app.route('/admin', methods=['GET'])
@jwt_required()  
def admin_dashboard():
    current_user_id = get_jwt_identity()
    user = Pengguna.query.get(current_user_id)

    if user.peran != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({"message": "Welcome to admin dashboard"}), 200

# Cashier Route
@app.route('/cashier', methods=['GET'])
@jwt_required() 
def cashier_dashboard():
    current_user_id = get_jwt_identity()
    user = Pengguna.query.get(current_user_id)

    if user.peran != 'cashier':
        return jsonify({"error": "Unauthorized"}), 403
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile_picture_base64 = None
    if user.profile_picture:
        image_format = imghdr.what(None, h=user.profile_picture)
        if image_format not in ['jpeg', 'jpg', 'png']:
            image_format = 'jpeg'
        profile_picture_base64 = f"data:image/{image_format};base64,{base64.b64encode(user.profile_picture).decode('utf-8')}"

    return jsonify({
        "id_pengguna": user.id_pengguna,
        "nama_pengguna": user.nama_pengguna,
        "username": user.username,
        "email": user.email,
        "kata_sandi": user.kata_sandi,
        "peran": user.peran,
        "profile_picture": profile_picture_base64 
    }), 200

# Kitchen Route
@app.route('/kitchen', methods=['GET'])
@jwt_required() 
def kitchen_dashboard():
    current_user_id = get_jwt_identity()
    user = Pengguna.query.get(current_user_id)

    if user.peran != 'kitchen':
        return jsonify({"error": "Unauthorized"}), 403
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile_picture_base64 = None
    if user.profile_picture:
        image_format = imghdr.what(None, h=user.profile_picture)
        if image_format not in ['jpeg', 'jpg', 'png']:
            image_format = 'jpeg'
        profile_picture_base64 = f"data:image/{image_format};base64,{base64.b64encode(user.profile_picture).decode('utf-8')}"

    return jsonify({
        "id_pengguna": user.id_pengguna,
        "nama_pengguna": user.nama_pengguna,
        "username": user.username,
        "email": user.email,
        "kata_sandi": user.kata_sandi,
        "peran": user.peran,
        "profile_picture": profile_picture_base64 
    }), 200

# Profile Route
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = Pengguna.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    profile_picture_base64 = None
    if user.profile_picture:
        image_format = imghdr.what(None, h=user.profile_picture)
        if image_format not in ['jpeg', 'jpg', 'png']:
            image_format = 'jpeg'
        profile_picture_base64 = f"data:image/{image_format};base64,{base64.b64encode(user.profile_picture).decode('utf-8')}"

    return jsonify({
        "id_pengguna": user.id_pengguna,
        "nama_pengguna": user.nama_pengguna,
        "username": user.username,
        "email": user.email,
        "kata_sandi": user.kata_sandi,
        "peran": user.peran,
        "profile_picture": profile_picture_base64 
    }), 200

