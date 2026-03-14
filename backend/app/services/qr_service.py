from pathlib import Path

import qrcode
from app.core.config import BASE_DIR


def generate_qr_png(viewer_url: str, card_id: str) -> str:
    output_dir = BASE_DIR / 'data' / 'qr'
    output_dir.mkdir(parents=True, exist_ok=True)

    filepath = output_dir / f'{card_id}.png'
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
    qr.add_data(viewer_url)
    qr.make(fit=True)
    image = qr.make_image(fill_color='black', back_color='white')
    image.save(filepath)

    return f'qr/{card_id}.png'
