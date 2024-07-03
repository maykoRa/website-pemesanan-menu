from flask_sqlalchemy import SQLAlchemy
import base64, imghdr

db = SQLAlchemy()

class Pengguna(db.Model):
    id_pengguna = db.Column(db.Integer, primary_key=True)
    nama_pengguna = db.Column(db.String(255))
    username = db.Column(db.String(255))
    email = db.Column(db.String(255))
    kata_sandi = db.Column(db.String(255))
    peran = db.Column(db.String(255))
    profile_picture = db.Column(db.LargeBinary, nullable=True)
    pesanan = db.relationship('Pesanan', backref='pengguna', lazy=True)

    def to_dict(self):
        return {
            "id_pengguna": self.id_pengguna,
            "nama_pengguna": self.nama_pengguna,
            "username": self.username,
            "email": self.email,
            "kata_sandi": self.kata_sandi,
            "peran": self.peran,
            "profile_picture": self.get_avatar(),
        }
    
    def get_avatar(self):
        if self.profile_picture is None:
            return None

        if isinstance(self.profile_picture, str):
            self.profile_picture = self.profile_picture.encode('utf-8')

        image_format = imghdr.what(None, h=self.profile_picture)

        if image_format not in ['jpeg', 'jpg', 'png']:
            image_format = 'jpeg'

        base64_image = base64.b64encode(self.profile_picture).decode('utf-8')
        return f"data:image/{image_format};base64,{base64_image}"

class Kategori(db.Model):
    id_kategori = db.Column(db.Integer, primary_key=True)
    nama_kategori = db.Column(db.String(255))
    deskripsi = db.Column(db.Text)
    menu = db.relationship('Menu', backref='kategori', lazy=True)

    def to_dict(self):
        return {
            "id_kategori": self.id_kategori,
            "nama_kategori": self.nama_kategori,
            "deskripsi": self.deskripsi
        }

class Menu(db.Model):
    id_menu = db.Column(db.Integer, primary_key=True)
    nama_menu = db.Column(db.String(255))
    deskripsi = db.Column(db.Text)
    harga = db.Column(db.Numeric)
    kategori_id = db.Column(db.Integer, db.ForeignKey('kategori.id_kategori'), nullable=False)
    gambar = db.Column(db.LargeBinary, nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    detail_pesanan = db.relationship('DetailPesanan', backref='menu', lazy=True)

    def to_dict(self):
        return {
            "id_menu": self.id_menu,
            "nama_menu": self.nama_menu,
            "deskripsi": self.deskripsi,
            "harga": str(self.harga),
            "kategori_id": self.kategori_id,
            "gambar": self.get_image(),
            "status": "active" if self.status else "inactive"
        }
    
    def get_image(self):
        if isinstance(self.gambar, str):
            self.gambar = self.gambar.encode('utf-8')

        image_format = imghdr.what(None, h=self.gambar)

        if image_format not in ['jpeg', 'jpg', 'png']:
            image_format = 'jpeg'

        base64_image = base64.b64encode(self.gambar).decode('utf-8')
        return f"data:image/{image_format};base64,{base64_image}"

class Pesanan(db.Model):
    id_pesanan = db.Column(db.Integer, primary_key=True)
    id_pengguna = db.Column(db.Integer, db.ForeignKey('pengguna.id_pengguna'), nullable=False)
    id_meja = db.Column(db.Integer)
    tanggal_pesanan = db.Column(db.DateTime)
    status_pesanan = db.Column(db.String(255))
    total_harga = db.Column(db.Numeric)
    pembayaran = db.relationship('Pembayaran', backref='pesanan', lazy=True)
    detail_pesanan = db.relationship('DetailPesanan', backref='pesanan', lazy=True)

    def to_dict(self):
        return {
            "id_pesanan": self.id_pesanan,
            "id_pengguna": self.id_pengguna,
            "id_meja": self.id_meja,
            "tanggal_pesanan": self.tanggal_pesanan.isoformat(),
            "status_pesanan": self.status_pesanan,
            "total_harga": str(self.total_harga)
        }

class DetailPesanan(db.Model):
    id_detail_pesanan = db.Column(db.Integer, primary_key=True)
    id_pesanan = db.Column(db.Integer, db.ForeignKey('pesanan.id_pesanan'), nullable=False)
    id_menu = db.Column(db.Integer, db.ForeignKey('menu.id_menu'), nullable=False)
    jumlah = db.Column(db.Integer)
    subtotal = db.Column(db.Numeric)

    def to_dict(self):
        return {
            "id_detail_pesanan": self.id_detail_pesanan,
            "id_pesanan": self.id_pesanan,
            "id_menu": self.id_menu,
            "jumlah": self.jumlah,
            "subtotal": str(self.subtotal)
        }

class Pembayaran(db.Model):
    id_pembayaran = db.Column(db.Integer, primary_key=True)
    id_pesanan = db.Column(db.Integer, db.ForeignKey('pesanan.id_pesanan'), nullable=False)
    metode_pembayaran = db.Column(db.String(255))
    tanggal_pembayaran = db.Column(db.DateTime)
    jumlah_bayar = db.Column(db.Numeric)
    kembalian = db.Column(db.Numeric)

    def to_dict(self):
        return {
            "id_pembayaran": self.id_pembayaran,
            "id_pesanan": self.id_pesanan,
            "metode_pembayaran": self.metode_pembayaran,
            "tanggal_pembayaran": self.tanggal_pembayaran.isoformat(),
            "jumlah_bayar": str(self.jumlah_bayar),
            "kembalian": str(self.kembalian)
        }
