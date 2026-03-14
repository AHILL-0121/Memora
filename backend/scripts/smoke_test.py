import json
import os
import time
from pathlib import Path

import httpx

BASE = 'http://127.0.0.1:8000/v1'


def get_env_value(key: str) -> str:
    env_value = os.getenv(key, '')
    if env_value:
        return env_value

    env_local = Path(__file__).resolve().parents[1] / '.env.local'
    if env_local.exists():
        for line in env_local.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            env_key, env_raw = line.split('=', 1)
            if env_key.strip() == key:
                return env_raw.strip()
    return ''


def main() -> int:
    with httpx.Client(timeout=20.0) as client:
        health = client.get('http://127.0.0.1:8000/health')
        health.raise_for_status()

        token = get_env_value('CLERK_TEST_JWT')
        if not token:
            print(json.dumps({'health': health.json(), 'note': 'Set CLERK_TEST_JWT to run authenticated route tests.'}, indent=2))
            return 0

        headers = {'Authorization': f'Bearer {token}'}

        auth_session = client.get(f'{BASE}/auth/session', headers=headers)
        auth_session.raise_for_status()

        signed_upload = client.post(
            f'{BASE}/upload/sign',
            headers=headers,
            json={
                'folder': 'media',
                'resource_type': 'video'
            },
        )
        signed_upload.raise_for_status()

        suffix = str(int(time.time()))
        target_url = 'http://127.0.0.1:8000/assets/targets/sample.mind'
        create = client.post(
            f'{BASE}/cards',
            headers=headers,
            json={
                'name': f'Smoke Card {suffix}',
                'photo_url': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                'media_url': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'target_url': target_url,
                'media_type': 'video',
                'is_public': True,
            },
        )
        create.raise_for_status()
        card = create.json()

        viewer = client.get(f"{BASE}/viewer/{card['id']}")
        viewer.raise_for_status()

        analytics = client.get(f"{BASE}/cards/{card['id']}/analytics", headers=headers)
        analytics.raise_for_status()

        print(json.dumps({
            'auth_user_id': auth_session.json()['user_id'],
            'signed_upload_cloud': signed_upload.json().get('cloud_name', ''),
            'created_card_id': card['id'],
            'created_card_target': card.get('target_url'),
            'viewer_status': viewer.status_code,
            'analytics_total_scans': analytics.json()['total_scans'],
        }, indent=2))

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
