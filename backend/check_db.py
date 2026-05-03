import asyncio
from sqlalchemy import text
from app.core.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT COUNT(*) as total FROM submissions"))
        count = result.fetchone()
        print(f"Total submissions in database: {count[0]}")
        
        result = await session.execute(text("SELECT id, ticket_id, risk_score, status FROM submissions LIMIT 5"))
        rows = result.fetchall()
        print("\nRecent submissions:")
        for row in rows:
            print(f"  ID: {row[0]}, Ticket: {row[1]}, Risk Score: {row[2]}, Status: {row[3]}")

if __name__ == "__main__":
    asyncio.run(main())

