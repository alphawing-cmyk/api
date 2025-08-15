from sqlalchemy import text, bindparam, String
from sqlalchemy.dialects.postgresql import ARRAY


GetWatchlistQuery = text("""
    WITH pairs(symbol, market) AS (
    SELECT DISTINCT *
    FROM UNNEST(
        CAST(:symbols AS text[]),
        CAST(:markets AS text[])
    )
    )
    SELECT
        t.id AS ticker_id,
        t.symbol AS symbol,
        t.market AS market,
        t.industry AS industry,
        h.custom_id,
        h.milliseconds,
        h.duration,
        h."open",
        h.low,
        h."close",
        h.high,
        h.adj_close,
        h.volume,
        h.vwap,
        h."timestamp",
        h.transactions,
        h.source,
        h.market
    FROM tickers t
    JOIN pairs p
    ON t.symbol = p.symbol AND t.market = p.market
    LEFT JOIN (
        SELECT *
        FROM (
            SELECT
                h.*,
                ROW_NUMBER() OVER (
                    PARTITION BY h.ticker_id
                    ORDER BY h."timestamp" DESC
                ) AS rn
            FROM historical h
            JOIN tickers t2 ON t2.id = h.ticker_id
            JOIN pairs p2 ON p2.symbol = t2.symbol AND p2.market = t2.market
        ) ranked
        WHERE rn <= 5
    ) h ON h.ticker_id = t.id
    ORDER BY t.id, h."timestamp" DESC
    """).bindparams(
        bindparam("symbols", type_=ARRAY(String())),
        bindparam("markets", type_=ARRAY(String())),
)



UpdateWatchlistQuery = text("""
    UPDATE users
    SET watchlist = COALESCE(watchlist, '[]'::jsonb)
                        || jsonb_build_array(jsonb_build_object('symbol', :symbol, 'market', :market))
    WHERE id = :uid
        AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(watchlist, '[]'::jsonb)) el
            WHERE el->>'symbol' = :symbol AND el->>'market' = :market
        )
    RETURNING id, watchlist
""")

DeleteWatchlistQuery = text("""
    UPDATE users u
    SET watchlist = sub.filtered
    FROM (
    SELECT u2.id,
            COALESCE(
            jsonb_agg(elem) FILTER (
                WHERE NOT (elem->>'market' = :market AND elem->>'symbol' = :symbol)
            ),
            '[]'::jsonb
            ) AS filtered
    FROM users u2
    LEFT JOIN LATERAL jsonb_array_elements(u2.watchlist) AS elem ON TRUE
    GROUP BY u2.id
    ) AS sub
    WHERE u.id = sub.id
    AND u.id = :uid;
""")