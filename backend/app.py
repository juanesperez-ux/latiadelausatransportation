#!/usr/bin/env python3
"""
La Tía de la USA Transportation — Booking API Backend
Python Flask REST API for handling booking requests.

Run:
  cd backend && pip install -r requirements.txt && python app.py
"""

import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

# ── App Setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# ── Data Store ─────────────────────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"
BOOKINGS_FILE = DATA_DIR / "bookings.json"


def ensure_data_dir():
    """Create data directory and bookings file if they don't exist."""
    DATA_DIR.mkdir(exist_ok=True)
    if not BOOKINGS_FILE.exists():
        with open(BOOKINGS_FILE, "w") as f:
            json.dump([], f)


def save_booking(booking: dict) -> dict:
    """Append a booking to the JSON store and return it with an ID."""
    ensure_data_dir()
    with open(BOOKINGS_FILE, "r") as f:
        bookings = json.load(f)

    booking["id"] = f"BK-{len(bookings) + 1:05d}"
    booking["created_at"] = datetime.utcnow().isoformat() + "Z"
    booking["status"] = "pending"

    bookings.append(booking)
    with open(BOOKINGS_FILE, "w") as f:
        json.dump(bookings, f, indent=2, default=str)

    app.logger.info(
        f"✅ Booking {booking['id']} saved: {booking.get('vehicle', 'N/A')} "
        f"for {booking.get('name', 'N/A')}"
    )
    return booking


# ── Validation ─────────────────────────────────────────────────────────────
def validate_booking(data: dict) -> list[str]:
    """Validate booking payload. Returns list of error messages (empty = valid)."""
    errors = []

    if not data.get("name", "").strip():
        errors.append("Full name is required.")
    if not data.get("email", "").strip():
        errors.append("Email is required.")
    elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", data.get("email", "")):
        errors.append("Email format is invalid.")
    if not data.get("phone", "").strip():
        errors.append("Phone number is required.")

    valid_vehicles = {
        "ct5", "s580", "tahoe", "suburban6", "suburban7",
        "escalade6", "escalade7", "escalade-sport", "escalade-platinum",
        "sprinter", "sprinter-limo", "cullinan", "phantom",
    }
    vehicle = data.get("vehicle", "")
    if vehicle and vehicle not in valid_vehicles:
        app.logger.warning(f"Unknown vehicle key: {vehicle}")

    valid_services = {"airport", "meetgreet", "hourly", "point"}
    svc = data.get("serviceType", "")
    if svc and svc not in valid_services:
        errors.append(f"Invalid service type: '{svc}'")

    return errors


# ── Routes ─────────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    ensure_data_dir()
    try:
        with open(BOOKINGS_FILE, "r") as f:
            booking_count = len(json.load(f))
    except Exception:
        booking_count = 0

    return jsonify(
        {
            "status": "healthy",
            "service": "La Tía de la USA — Booking API",
            "version": "1.0.0",
            "bookings_stored": booking_count,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    ), 200


@app.route("/api/book", methods=["POST"])
def book_ride():
    """Handle a booking request."""
    data = request.get_json(silent=True)
    if not data:
        app.logger.warning("Empty or invalid JSON payload received")
        return jsonify({"status": "error", "message": "Invalid request body. JSON expected."}), 400

    app.logger.info(f"📨 Booking request: {json.dumps(data, default=str)[:300]}")

    # Validate
    errors = validate_booking(data)
    if errors:
        app.logger.warning(f"❌ Validation failed: {errors}")
        return jsonify(
            {
                "status": "error",
                "message": "Validation failed.",
                "errors": errors,
            }
        ), 422

    # Save
    try:
        booking = save_booking(data)
    except Exception as e:
        app.logger.error(f"Failed to save booking: {e}")
        return jsonify(
            {"status": "error", "message": "Internal server error. Please try again."}
        ), 500

    return (
        jsonify(
            {
                "status": "success",
                "message": f"Booking request received successfully. Your reference is {booking['id']}.",
                "booking_id": booking["id"],
                "estimated_total": data.get("total", "N/A"),
                "next_steps": {
                    "confirmation": "We will confirm availability within 30 minutes.",
                    "contact": "For immediate assistance, call (305) 555-0100.",
                },
            }
        ),
        201,
    )


@app.route("/api/bookings", methods=["GET"])
def list_bookings():
    """List all stored bookings (admin use)."""
    ensure_data_dir()
    try:
        with open(BOOKINGS_FILE, "r") as f:
            bookings = json.load(f)
    except Exception:
        bookings = []
    return jsonify({"count": len(bookings), "bookings": bookings}), 200


# ── Main ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("╔══════════════════════════════════════════════════════╗")
    print("║  La Tía de la USA Transportation — Booking API      ║")
    print("║  Running on http://localhost:5000                   ║")
    print("║  Health check: http://localhost:5000/api/health     ║")
    print("╚══════════════════════════════════════════════════════╝")
    app.run(debug=True, port=5000, host="0.0.0.0")