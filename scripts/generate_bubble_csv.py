import json
import csv
from datetime import datetime

REF_DATE = datetime(2026, 1, 1)

def evaluate_book_badge(book):
    pending = book.get('royalty_pending') or 0
    status = book.get('status')
    pub_date = datetime.strptime(book['publication_date'], '%Y-%m-%d') if book.get('publication_date') else None
    last_payout = datetime.strptime(book['last_royalty_payout_date'], '%Y-%m-%d') if book.get('last_royalty_payout_date') else None

    if status != 'Published & Live':
        return 'Info', 'In Production'
    if pending == 0:
        return 'Green', 'Fully Paid'
    
    days_since_payout = (REF_DATE - last_payout).days if last_payout else None
    days_since_pub = (REF_DATE - pub_date).days if pub_date else None

    if last_payout and days_since_payout > 90:
        return 'Red', f'Overdue (last payout {days_since_payout} days ago)'
    elif not last_payout and days_since_pub and days_since_pub > 90:
        return 'Red', f'Overdue (published {days_since_pub} days ago, no payout yet)'
    else:
        return 'Yellow', 'Pending within normal cycle'

def main():
    with open('bookleaf_sample_data.json', 'r') as f:
        data = json.load(f)

    authors_rows = []
    books_rows = []
    users_rows = []

    # Add Admin user
    users_rows.append({
        'email': 'admin@bookleaf.com',
        'role': 'Admin',
        'author_id': '',
        'name': 'BookLeaf Operations Admin',
        'initial_password': 'AdminPassword2026!'
    })

    for a in data['authors']:
        total_earned = sum(b.get('total_royalty_earned') or 0 for b in a['books'])
        total_paid = sum(b.get('royalty_paid') or 0 for b in a['books'])
        total_pending = sum(b.get('royalty_pending') or 0 for b in a['books'])
        
        # Determine overall author payout status
        has_red = False
        has_yellow = False
        for b in a['books']:
            badge, reason = evaluate_book_badge(b)
            if badge == 'Red':
                has_red = True
            elif badge == 'Yellow':
                has_yellow = True

        if has_red:
            author_payout_status = 'Overdue'
        elif has_yellow:
            author_payout_status = 'Pending'
        else:
            author_payout_status = 'Fully Paid'

        authors_rows.append({
            'author_id': a['author_id'],
            'name': a['name'],
            'email': a['email'],
            'phone': a['phone'],
            'city': a['city'],
            'joined_date': a['joined_date'],
            'total_books': len(a['books']),
            'total_earned': total_earned,
            'total_paid': total_paid,
            'total_pending': total_pending,
            'payout_status': author_payout_status
        })

        # Add Author user
        users_rows.append({
            'email': a['email'],
            'role': 'Author',
            'author_id': a['author_id'],
            'name': a['name'],
            'initial_password': 'AuthorPassword2026!'
        })

        for b in a['books']:
            badge, reason = evaluate_book_badge(b)
            books_rows.append({
                'book_id': b['book_id'],
                'author_id': a['author_id'],
                'author_name': a['name'],
                'title': b['title'],
                'isbn': b.get('isbn') or '',
                'genre': b.get('genre') or '',
                'publication_date': b.get('publication_date') or '',
                'status': b.get('status') or '',
                'mrp': b.get('mrp') if b.get('mrp') is not None else '',
                'author_royalty_per_copy': b.get('author_royalty_per_copy') if b.get('author_royalty_per_copy') is not None else '',
                'total_copies_sold': b.get('total_copies_sold', 0),
                'total_royalty_earned': b.get('total_royalty_earned', 0),
                'royalty_paid': b.get('royalty_paid', 0),
                'royalty_pending': b.get('royalty_pending', 0),
                'last_royalty_payout_date': b.get('last_royalty_payout_date') or '',
                'print_partner': b.get('print_partner') or '',
                'available_on': ', '.join(b.get('available_on') or []),
                'payout_badge': badge,
                'badge_reason': reason
            })

    # Write authors.csv
    with open('bubble_data/authors.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=authors_rows[0].keys())
        writer.writeheader()
        writer.writerows(authors_rows)

    # Write books.csv
    with open('bubble_data/books.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=books_rows[0].keys())
        writer.writeheader()
        writer.writerows(books_rows)

    # Write users.csv
    with open('bubble_data/users.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=users_rows[0].keys())
        writer.writeheader()
        writer.writerows(users_rows)

    # Write notification_logs_template.csv
    notification_log_fields = [
        'author_id',
        'author_name',
        'author_email',
        'sent_at',
        'status',
        'email_subject',
        'email_body',
        'trigger_type',
        'error_message'
    ]
    with open('bubble_data/notification_logs_template.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=notification_log_fields)
        writer.writeheader()
        # Initial sample log row for demonstration
        writer.writerow({
            'author_id': 'AUTH001',
            'author_name': 'Priya Sharma',
            'author_email': 'priya.sharma@email.com',
            'sent_at': '2026-01-15T10:30:00Z',
            'status': 'Success',
            'email_subject': 'BookLeaf Publishing: Your Quarterly Royalty Statement & Update',
            'email_body': 'Dear Priya Sharma,\n\nHere is your royalty breakdown across your published titles...\n\nTotal Earned: ₹19,908 | Total Paid: ₹16,338 | Total Pending: ₹3,570\n\nWarm regards,\nBookLeaf Author Support Team',
            'trigger_type': 'Single',
            'error_message': ''
        })

    print(f"Generated bubble_data/authors.csv ({len(authors_rows)} rows)")
    print(f"Generated bubble_data/books.csv ({len(books_rows)} rows)")
    print(f"Generated bubble_data/users.csv ({len(users_rows)} rows)")
    print("Generated bubble_data/notification_logs_template.csv")

if __name__ == '__main__':
    main()
