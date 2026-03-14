from pathlib import Path

import httpx


def parse_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        values[key.strip()] = value.strip()
    return values


def write_env_value(path: Path, key: str, value: str) -> None:
    lines = path.read_text(encoding='utf-8').splitlines() if path.exists() else []
    output: list[str] = []
    replaced = False
    for line in lines:
        if line.startswith(f'{key}='):
            output.append(f'{key}={value}')
            replaced = True
        else:
            output.append(line)

    if not replaced:
        output.append(f'{key}={value}')

    path.write_text('\n'.join(output) + '\n', encoding='utf-8')


def main() -> int:
    env_path = Path(__file__).resolve().parents[1] / '.env.local'
    env = parse_env(env_path)
    secret = env.get('CLERK_SECRET_KEY', '')
    if not secret:
        print('CLERK_SECRET_KEY missing in backend/.env.local')
        return 2

    with httpx.Client(timeout=20.0) as client:
        response = client.post(
            'https://api.clerk.com/v1/testing_tokens',
            headers={
                'Authorization': f'Bearer {secret}',
                'Content-Type': 'application/json',
            },
            json={},
        )
        response.raise_for_status()
        token = response.json().get('token', '')

    if not token:
        print('Failed to get Clerk testing token')
        return 3

    write_env_value(env_path, 'CLERK_TEST_JWT', token)
    print('CLERK_TEST_JWT updated in backend/.env.local')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
