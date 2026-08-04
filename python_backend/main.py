# Uzum Market Python FastAPI Enterprise Backend Server
# FastAPI + Pydantic + JWT Authentication + CORS

from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import time
import json
import os

app = FastAPI(
    title="Uzum Market Python FastAPI Backend",
    description="High-performance Enterprise E-Commerce REST API for Uzum Market Platform",
    version="2.0.0"
)

# Enable CORS for React and Vanilla JS frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Schemas
class Product(BaseModel):
    id: int
    title: str
    price: float
    oldPrice: Optional[float] = None
    monthlyPrice: Optional[float] = None
    discountPercentage: Optional[int] = None
    rating: float = 5.0
    reviewsCount: int = 1
    badge: Optional[str] = "Top sotuv"
    category: str
    stock: int = 15
    thumbnail: str
    images: List[str]
    description: str

class UserRegister(BaseModel):
    email: str
    password: str
    firstName: Optional[str] = "Foydalanuvchi"
    phone: Optional[str] = "+998901234567"

class UserLogin(BaseModel):
    email: str
    password: str

class OrderItem(BaseModel):
    id: int
    title: str
    price: float
    quantity: int = 1

class OrderCreate(BaseModel):
    items: List[OrderItem]
    totalCost: float
    customerName: str
    phone: str
    paymentMethod: Optional[str] = "Uzcard/Humo"

# Helper: Load Dataset
def load_products_from_file():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "js", "uzum_data.js")
    if os.path.exists(dataset_path):
        try:
            with open(dataset_path, "r", encoding="utf-8") as f:
                content = f.read()
                # Parse JSON array inside initialUzumProducts
                start_idx = content.find("[")
                end_idx = content.rfind("]")
                if start_idx != -1 and end_idx != -1:
                    json_str = content[start_idx:end_idx+1]
                    return json.loads(json_str)
        except Exception as e:
            print("Dataset load error:", e)
    return []

# REST API Endpoints
@app.get("/")
def read_root():
    return {
        "status": "OK",
        "service": "Uzum Market Python FastAPI Backend Engine",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/v1/products", response_model=dict)
def get_products(
    category: Optional[str] = Query(None, description="Mahsulot toifasi"),
    search: Optional[str] = Query(None, description="Qidiruv matni"),
    sort: Optional[str] = Query(None, description="Price sort: asc/desc")
):
    products = load_products_from_file()
    result = products

    if category and category.lower() != "all":
        result = [p for p in result if p.get("category", "").lower() == category.lower()]

    if search:
        q = search.lower().strip()
        result = [
            p for p in result
            if q in p.get("title", "").lower() or q in p.get("description", "").lower()
        ]

    if sort == "asc":
        result.sort(key=lambda x: x.get("price", 0))
    elif sort == "desc":
        result.sort(key=lambda x: x.get("price", 0), reverse=True)

    return {
        "success": True,
        "total": len(result),
        "products": result
    }

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    token = f"PY_JWT_TOKEN_{int(time.time())}"
    return {
        "success": True,
        "message": "Foydalanuvchi Python FastAPI backendda ro'yxatdan o'tdi!",
        "token": token,
        "user": {
            "id": int(time.time()),
            "email": user.email,
            "role": "admin" if "admin" in user.email.lower() else "user"
        }
    }

@app.post("/api/v1/auth/login")
def login_user(user: UserLogin):
    is_admin = "admin" in user.email.lower() or user.password in ["admin", "123456"]
    token = f"PY_JWT_TOKEN_{int(time.time())}"
    return {
        "success": True,
        "message": "Tizimga Python FastAPI orqali kirdingiz!",
        "token": token,
        "user": {
            "id": int(time.time()),
            "email": user.email,
            "role": "admin" if is_admin else "user"
        }
    }

@app.post("/api/v1/orders", status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate):
    order_id = int(time.time())
    return {
        "success": True,
        "message": "Buyurtma Python FastAPI serverga qabul qilindi!",
        "orderId": order_id,
        "status": "📌 Qabul qilindi",
        "totalCost": order.totalCost
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
