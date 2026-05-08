"""
Script untuk inisialisasi database: membuat tabel dan seeder data.
"""
import asyncio
import time
from sqlalchemy import text
from app.core.database import Base, engine, AsyncSessionLocal
from app.models import WhitelistURL, WhitelistPhone
from app.core.config import settings


async def wait_for_db(max_attempts=30):
    """Wait for database to be ready."""
    print("⏳ Waiting for database to be ready...")
    for attempt in range(max_attempts):
        try:
            async with engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
            print("✅ Database is ready!")
            return True
        except Exception as e:
            print(f"⏳ Attempt {attempt + 1}/{max_attempts}: Database not ready yet. ({type(e).__name__})")
            await asyncio.sleep(1)
    
    raise Exception("Database connection failed after max retries")


async def init_database():
    """
    Inisialisasi database:
    1. Drop existing tables (opsional)
    2. Create all tables
    3. Insert seed data
    """
    print("🔄 Starting database initialization...")
    print(f"📌 Database URL: {settings.DATABASE_URL}")
    
    async with engine.begin() as conn:
        # Drop semua tabel terlebih dahulu (opsional - uncomment jika ingin reset)
        # print("🗑️  Dropping existing tables...")
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Buat semua tabel
        print("📋 Creating database tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables created successfully!")
    
    # Insert seed data
    print("🌱 Inserting seed data...")
    async with AsyncSessionLocal() as session:
        # ===== Whitelist URLs =====
        # Check if data already exists
        from sqlalchemy import select
        
        existing_urls = await session.execute(select(WhitelistURL))
        if not existing_urls.scalars().first():
            whitelist_urls_data = [
                WhitelistURL(domain="cimbniaga.co.id", is_active=True),
                WhitelistURL(domain="bca.co.id", is_active=True),
                WhitelistURL(domain="mandiri.co.id", is_active=True),
                WhitelistURL(domain="bni.co.id", is_active=True),
                WhitelistURL(domain="google.com", is_active=True),
                WhitelistURL(domain="github.com", is_active=True),
                WhitelistURL(domain="stackoverflow.com", is_active=True),
            ]
            session.add_all(whitelist_urls_data)
            print(f"  ✅ Added {len(whitelist_urls_data)} whitelisted URLs")
        else:
            print("  ⚠️  Whitelist URLs already exist, skipping...")
        
        # ===== Whitelist Phones =====
        existing_phones = await session.execute(select(WhitelistPhone))
        if not existing_phones.scalars().first():
            whitelist_phones_data = [
                WhitelistPhone(phone_number="+62215606666", is_active=True),  # CIMB Niaga
                WhitelistPhone(phone_number="+62215511111", is_active=True),  # BCA
                WhitelistPhone(phone_number="+62215250200", is_active=True),  # Mandiri
                WhitelistPhone(phone_number="+62212900900", is_active=True),  # BNI
                WhitelistPhone(phone_number="+62800111999", is_active=True),  # Customer Service
                WhitelistPhone(phone_number="+14041111111", is_active=True),  # Support USA
            ]
            session.add_all(whitelist_phones_data)
            print(f"  ✅ Added {len(whitelist_phones_data)} whitelisted phone numbers")
        else:
            print("  ⚠️  Whitelist Phones already exist, skipping...")
        
        await session.commit()
        print("✅ Seed data inserted successfully!")
    
    print("\n🎉 Database initialization completed!")
    await engine.dispose()


async def main():
    """Entry point untuk init script."""
    try:
        await wait_for_db()
        await init_database()
    except Exception as e:
        print(f"❌ Error during database initialization: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
