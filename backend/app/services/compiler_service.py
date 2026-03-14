from pathlib import Path

from app.core.config import BASE_DIR


def simulate_target_compile(card_id: str) -> str:
    output_dir = BASE_DIR / 'data' / 'targets'
    output_dir.mkdir(parents=True, exist_ok=True)
    target_file = output_dir / f'{card_id}.mind'
    target_file.write_text(f'MOCK_MIND_TARGET:{card_id}', encoding='utf-8')
    return str(target_file).replace('\\', '/')
