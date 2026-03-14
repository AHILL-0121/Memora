from collections import Counter
from datetime import datetime, timedelta

from app.models import ScanLog


def analytics_from_scan_logs(card_id: str, scan_logs: list[ScanLog]):
    now = datetime.utcnow()
    last_7 = now - timedelta(days=7)
    last_30 = now - timedelta(days=30)

    scans_7 = sum(1 for log in scan_logs if log.scanned_at >= last_7)
    scans_30 = sum(1 for log in scan_logs if log.scanned_at >= last_30)

    country_counter = Counter((log.country or 'UNKNOWN') for log in scan_logs)
    device_counter = Counter((log.device_type or 'unknown') for log in scan_logs)

    by_country = [{'country': country, 'count': count} for country, count in country_counter.most_common()]
    by_device = [{'device_type': device, 'count': count} for device, count in device_counter.most_common()]

    return {
        'card_id': card_id,
        'total_scans': len(scan_logs),
        'scans_last_7_days': scans_7,
        'scans_last_30_days': scans_30,
        'by_country': by_country,
        'by_device': by_device
    }
