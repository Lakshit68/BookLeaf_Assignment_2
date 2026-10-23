# Bubble.io Step-by-Step Implementation Guide
## BookLeaf Publishing: Author Royalty Dashboard & Automated Notification System

This guide provides the complete, click-by-click blueprint to set up the entire application on **Bubble.io (Free Plan)** in under 60 minutes.

---

### Table of Contents
1. [Prerequisites & Account Setup](#1-prerequisites--account-setup)
2. [Data Types & Database Schema](#2-data-types--database-schema)
3. [CSV Data Import](#3-csv-data-import)
4. [Bubble Privacy Rules Configuration](#4-bubble-privacy-rules-configuration)
5. [Page 1: Author Portal (`author_portal`)](#5-page-1-author-portal-author_portal)
6. [Page 2: Admin Portal (`admin_portal`)](#6-page-2-admin-portal-admin_portal)
7. [API Connector Setup (Bubble ↔ n8n)](#7-api-connector-setup-bubble--n8n)
8. [Workflows & Frontend Error Handling](#8-workflows--frontend-error-handling)
9. [Bubble Backend Workflow (Callback Handler)](#9-bubble-backend-workflow-callback-handler)

---

### 1. Prerequisites & Account Setup
1. Log in to [Bubble.io](https://bubble.io) (Free plan).
2. Click **Create an App**.
   - **Name**: `bookleaf-royalty-ops` (or your preferred unique name).
   - **Component Library**: Skip or Start from Scratch.
3. Open **Settings > API**:
   - Check **Enable Data API**.
   - Check **Author**, **Book**, and **Notification_Log** under Data API exposure.
   - Click **Generate a new API token** and save it as `BUBBLE_API_TOKEN`.

---

### 2. Data Types & Database Schema
Go to **Data > Data types** and create four entities:

#### A. Data Type: `User` (Built-in)
Add custom fields:
- `role` (Type: `text`, default: `"Author"`) — Values: `"Admin"` or `"Author"`
- `name` (Type: `text`)
- `author_profile` (Type: `Author`)

#### B. Data Type: `Author`
Click **New type** > `Author`. Add fields:
- `author_id` (Type: `text`)
- `name` (Type: `text`)
- `email` (Type: `text`)
- `phone` (Type: `text`)
- `city` (Type: `text`)
- `joined_date` (Type: `date`)
- `total_books` (Type: `number`)
- `total_earned` (Type: `number`)
- `total_paid` (Type: `number`)
- `total_pending` (Type: `number`)
- `payout_status` (Type: `text`) — Values: `"Fully Paid"`, `"Pending"`, `"Overdue"`
- `books` (Type: `List of Books`)
- `user` (Type: `User`)

#### C. Data Type: `Book`
Click **New type** > `Book`. Add fields:
- `book_id` (Type: `text`)
- `author` (Type: `Author`)
- `author_id` (Type: `text`)
- `author_name` (Type: `text`)
- `title` (Type: `text`)
- `isbn` (Type: `text`)
- `genre` (Type: `text`)
- `publication_date` (Type: `date`)
- `status` (Type: `text`) — e.g. `"Published & Live"`, `"In Production - Cover Design"`, `"In Production - Typesetting"`
- `mrp` (Type: `number`)
- `author_royalty_per_copy` (Type: `number`)
- `total_copies_sold` (Type: `number`)
- `total_royalty_earned` (Type: `number`)
- `royalty_paid` (Type: `number`)
- `royalty_pending` (Type: `number`)
- `last_royalty_payout_date` (Type: `date`)
- `print_partner` (Type: `text`) — `"In-House"`, `"Repro India"`, `"Epitome Books"`
- `available_on` (Type: `text`) — comma-separated platform list
- `payout_badge` (Type: `text`) — `"Green"`, `"Yellow"`, `"Red"`, `"Info"`
- `badge_reason` (Type: `text`)

#### D. Data Type: `Notification_Log`
Click **New type** > `Notification_Log`. Add fields:
- `author_id` (Type: `text`)
- `author_name` (Type: `text`)
- `author_email` (Type: `text`)
- `sent_at` (Type: `date`)
- `status` (Type: `text`) — `"Success"` or `"Failed"`
- `email_subject` (Type: `text`)
- `email_body` (Type: `text`)
- `trigger_type` (Type: `text`) — `"Single"` or `"Bulk"`
- `error_message` (Type: `text`)

---

### 3. CSV Data Import
The exact sample data is pre-formatted in the [`bubble_data/`](file:///Users/deevs/Documents/Book_leaf_2/bubble_data) directory:

1. **Import Authors**:
   - Go to **Data > App data > All Authors**.
   - Click **Upload**.
   - Select [`bubble_data/authors.csv`](file:///Users/deevs/Documents/Book_leaf_2/bubble_data/authors.csv).
   - Map columns to fields and click **Upload data** (10 records imported).
2. **Import Books**:
   - Go to **Data > App data > All Books**.
   - Click **Upload**.
   - Select [`bubble_data/books.csv`](file:///Users/deevs/Documents/Book_leaf_2/bubble_data/books.csv).
   - Map columns and upload (18 records imported).
3. **Import Users**:
   - Go to **Data > App data > All Users**.
   - Click **Upload**.
   - Select [`bubble_data/users.csv`](file:///Users/deevs/Documents/Book_leaf_2/bubble_data/users.csv).
   - Upload (11 accounts: 1 admin + 10 authors).
   - *Test credentials are provided in the README.*

---

### 4. Bubble Privacy Rules Configuration (Requirement A4)
Go to **Data > Privacy** and configure data isolation:

#### For `Author` Data Type:
1. **Rule 1: Admin Full Access**
   - Condition: `Current User's role is "Admin"`
   - Check all: *View all fields*, *Find this in searches*, *View attached files*.
2. **Rule 2: Author Self Access**
   - Condition: `Current User's author_profile is This Author`
   - Check: *View all fields*, *Find this in searches*.
3. **Everyone Else (Default)**:
   - **UNCHECK** all checkboxes. Prevents anonymous or cross-author data leakage.

#### For `Book` Data Type:
1. **Rule 1: Admin Full Access**
   - Condition: `Current User's role is "Admin"`
   - Check all permissions.
2. **Rule 2: Author's Own Books**
   - Condition: `This Book's author is Current User's author_profile`
   - Check all permissions.
3. **Everyone Else (Default)**:
   - **UNCHECK** all checkboxes.

#### For `Notification_Log` Data Type:
1. **Rule 1: Admin Full Access**: `Current User's role is "Admin"` -> All permissions.
2. **Rule 2: Author Own Logs**: `This Notification_Log's author_id is Current User's author_profile's author_id` -> Read permissions.
3. **Everyone Else**: Uncheck all.

---

### 5. Page 1: Author Portal (`author_portal`)

#### A. Header & User Identity
- Left: BookLeaf Publishing Logo + "Author Portal".
- Right: `Current User's name` + "Sign Out" button (Workflow: *Log the user out* > *Go to page index*).

#### B. Consolidated Royalty Summary Banner (Top Cards)
Create 3 Card Containers:
- **Card 1: Total Earned**: `₹ Current User's author_profile's total_earned :formatted as 1,028`
- **Card 2: Total Paid**: `₹ Current User's author_profile's total_paid :formatted as 1,028`
- **Card 3: Total Pending**: `₹ Current User's author_profile's total_pending :formatted as 1,028` (Highlighted in warm amber/gold).

#### C. "My Books" Repeating Group
- **Type of Content**: `Book`
- **Data Source**: `Search for Books` (Constraint: `author_id = Current User's author_profile's author_id`)
- **Row Elements**:
  1. **Book Title & ISBN**: Bold Title, ISBN text, and Genre badge.
  2. **Publication Date & MRP**: `₹ This Book's mrp` | `This Book's publication_date:formatted as 20 Feb 2024`.
  3. **Platform Availability**: Tag list (Amazon India, Flipkart, BookLeaf Store).
  4. **Performance Breakdown**:
     - Copies Sold: `This Book's total_copies_sold`
     - Royalty Per Copy: `₹ This Book's author_royalty_per_copy`
     - Total Earned: `₹ This Book's total_royalty_earned`
     - Royalty Paid: `₹ This Book's royalty_paid`
     - Royalty Pending: `₹ This Book's royalty_pending`
     - Last Payout: `This Book's last_royalty_payout_date:formatted as 15 Oct 2025` (or *"No payout recorded"* if empty).
  5. **Royalty Status Indicator Badge**:
     - Add a Group with Dynamic Text: `This Book's payout_badge`
     - **Conditional Styles**:
       - *Condition 1*: `This Book's payout_badge is "Green"`
         -> Background: `#ECFDF5` (emerald-50), Text: `#065F46` (emerald-800), Label: `"✓ Fully Paid"`
       - *Condition 2*: `This Book's payout_badge is "Yellow"`
         -> Background: `#FEFCE8` (yellow-50), Text: `#854D0E` (yellow-800), Label: `"⏳ Within Normal Cycle"`
       - *Condition 3*: `This Book's payout_badge is "Red"`
         -> Background: `#FEF2F2` (rose-50), Text: `#991B1B` (rose-800), Label: `"⚠ Payout Overdue"`
       - *Condition 4*: `This Book's status contains "In Production"`
         -> Background: `#EFF6FF` (blue-50), Text: `#1E40AF` (blue-800), Label: `"🛠 In Production"`

---

### 6. Page 2: Admin Portal (`admin_portal`)

#### A. Admin Control Bar & Overview Stats
- **Header**: "BookLeaf Publishing Operations Dashboard".
- **Top Stats Grid**:
  - Total Authors: `Search for Authors:count` (10)
  - Total Titles: `Search for Books:count` (18)
  - Total Royalties Accrued: `Search for Books's total_royalty_earned:sum` (₹2,50,000+)
  - Total Outstanding Payouts: `Search for Books's royalty_pending:sum`
- **Search & Filter Controls**:
  - Input: `Input Search Author` (placeholder: "Search by author name...")
  - Dropdown: `Dropdown City` (Choices: "All Cities", "Mumbai", "Delhi", "Hyderabad", "Pune", "Kochi", "Chandigarh", "Bangalore", "Lucknow", "Nagpur", "Kolkata")
  - Dropdown: `Dropdown Payout Status` (Choices: "All Statuses", "Fully Paid", "Pending", "Overdue")
  - **Button**: `"⚡ Bulk Trigger Royalty Summaries"` (Styled in distinct purple/indigo).

#### B. Authors Repeating Group
- **Data Source**: `Search for Authors`
  - *Dynamic constraints*:
    - If `Input Search Author` is not empty: `name contains Input Search Author's value`
    - If `Dropdown City's value != "All Cities"`: `city = Dropdown City's value`
    - If `Dropdown Payout Status != "All Statuses"`: `payout_status = Dropdown Payout Status's value`
- **Columns**:
  - Author Name & ID
  - City & Joined Date
  - Total Books (`This Author's total_books`)
  - Total Earned / Paid / Pending
  - Payout Status Badge (Green / Yellow / Red)
  - **Action Button**: `"View & Trigger"` -> Opens Author Detail Modal.

#### C. Author Detail Modal / Sub-View
- Triggered by clicking an author row. Sets custom state `selected_author = Current cell's Author`.
- Displays:
  - Author Profile header with contact info (`phone`, `email`, `city`).
  - Catalog list of all books with complete sales and royalty figures.
  - **Primary CTA Button**: `"Generate & Send Royalty Summary"`
    - Workflow calls n8n webhook (see Section 7 & 8).
    - Includes button loading state (`Button is disabled when custom state is_processing is "yes"`).

#### D. Notification Log Section
- Repeating group at bottom: `Search for Notification_Logs` sorted by `sent_at` descending.
- Columns:
  - `Author Name` & `Email`
  - `Sent At` (`formatted as 23 Oct 2026, 11:30 AM`)
  - `Status Badge`:
    - Green: `"✓ Success"`
    - Red: `"✕ Failed"`
  - `Trigger Type`: `"Single"` or `"Bulk"`
  - `Email Subject`
  - **Button**: `"Inspect Email"` -> Opens popup displaying full AI-generated email body.

---

### 7. API Connector Setup (Bubble ↔ n8n)
1. Go to **Plugins > Add Plugins** and install **API Connector** by Bubble.
2. Click **Add another API**:
   - **API Name**: `n8n Royalty Service`
   - **Authentication**: None or Private key in header
3. Add **Header Parameters**:
   - Key: `x-bookleaf-api-key` | Value: `bookleaf_secure_webhook_token_2026`
   - Key: `Content-Type` | Value: `application/json`
4. Click **Add another call**:
   - **Call Name**: `Trigger Royalty Summary`
   - **Use as**: `Action`
   - **Data type**: `JSON`
   - **Method**: `POST`
   - **URL**: `https://[your-n8n-instance-or-ngrok]/webhook/bookleaf-royalty-summary`
   - **Body Type**: `JSON`
   - **Body Template**:
     ```json
     {
       "author_id": "<author_id>",
       "name": "<name>",
       "email": "<email>",
       "city": "<city>",
       "trigger_type": "<trigger_type>",
       "books": [
         {
           "book_id": "<b_id>",
           "title": "<b_title>",
           "isbn": "<b_isbn>",
           "genre": "<b_genre>",
           "status": "<b_status>",
           "publication_date": "<b_pub_date>",
           "mrp": <b_mrp>,
           "author_royalty_per_copy": <b_rate>,
           "total_copies_sold": <b_sold>,
           "total_royalty_earned": <b_earned>,
           "royalty_paid": <b_paid>,
           "royalty_pending": <b_pending>,
           "last_royalty_payout_date": "<b_last_payout>",
           "print_partner": "<b_partner>",
           "available_on": ["Amazon India", "Flipkart", "BookLeaf Store"]
         }
       ]
     }
     ```
   - Uncheck **Private** on parameters so Bubble workflows can populate them dynamically.
   - Click **Initialize call** to verify connection.

---

### 8. Workflows & Frontend Error Handling

#### Single Trigger Workflow ("Generate & Send Royalty Summary"):
1. **Step 1**: Set Custom State `is_processing = "yes"` on the button.
2. **Step 2**: Trigger API Connector: `n8n Royalty Service - Trigger Royalty Summary`
   - Pass `author_id = selected_author's author_id`
   - Pass `name = selected_author's name`
   - Pass `email = selected_author's email`
   - Pass `trigger_type = "Single"`
3. **Step 3 (Error Handling)**:
   - Add condition on Step 4: *Only when Result of Step 2's status is "success"*.
   - If Step 2 returns an error or status is empty:
     - Show Alert banner: `"Error: Unable to connect to n8n automation service. Please check webhook endpoint."`
     - Set Custom State `is_processing = "no"`.
4. **Step 4**: Create a new `Notification_Log`:
   - `author_id = selected_author's author_id`
   - `author_name = selected_author's name`
   - `author_email = selected_author's email`
   - `sent_at = Current date/time`
   - `status = Result of Step 2's status` (or `"Success"`)
   - `email_subject = Result of Step 2's email_subject`
   - `trigger_type = "Single"`
5. **Step 5**: Set Custom State `is_processing = "no"`.
6. **Step 6**: Show Floating Alert: `"Royalty summary generated and sent successfully!"`

#### Bulk Trigger Workflow ("Bulk Trigger"):
1. Set button custom state `bulk_running = "yes"`.
2. Schedule API Workflow on a list (or run repeating group iteration):
   - **List to run on**: `Search for Authors (constraint: total_pending > 0)`
   - Dispatches webhook call for each eligible author.
3. Show confirmation notification: `"Dispatched royalty summaries for all authors with pending royalties."`
4. Set `bulk_running = "no"`.

---

### 9. Bubble Backend Workflow (Callback Handler)
If using the asynchronous n8n callback approach:
1. Go to **Settings > API > Enable Workflow API and backend workflows**.
2. Open **Backend workflows** from the page selector dropdown.
3. Add a new API workflow: `n8n_royalty_callback`
   - Parameter definition:
     - `author_id` (text)
     - `author_name` (text)
     - `author_email` (text)
     - `status` (text)
     - `email_subject` (text)
     - `email_body` (text)
     - `trigger_type` (text)
     - `error_message` (text)
4. Action: **Create a new thing > Notification_Log**
   - Maps each parameter directly to the database.
5. In n8n Node 9 (`Bubble: Log Notification`), set URL to:
   `https://[your-app].bubbleapps.io/version-test/api/1.1/wf/n8n_royalty_callback`
