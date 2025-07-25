import pandas as pd
from typing import Dict, List
import numpy as np
from components.stats.utils import setHistoricalDFColTypes

class Indicators:

    def __init__(
        self, 
        df: pd.DataFrame, 
        indicators: List[Dict[str, any]]
    ):
        self.df         = df.copy()
        self.indicators = indicators
    
    def processIndicators(self):

        if self.df.shape[0] == 0:
            return

        for indicator in self.indicators:
            if indicator.get("name").upper() == "MA":
                self.MA(int(indicator.get("period")))
            if indicator.get("name").upper() == "RSI":
                 self.RSI(int(indicator.get("period")))
            if indicator.get("name").upper() == "ATR":
                 self.ATR(int(indicator.get("period")))
            if indicator.get("name").upper() == "RETURN":
                 self.RETURNS()
            if indicator.get("name").upper() == "VOLATILITY":
                 self.VOLATILITY()
                 
    def MA(self, period: int = 20):
        self.df[f"MA_{period}"] = self.df['close'] \
                        .rolling(window=period) \
                        .mean() \
                        .round(decimals=2)
        self.df[f"MA_{period}"] = self.df[f"MA_{period}"].replace({np.nan: None})
    
    def RSI(self, period: int = 14):
        delta    = self.df['close'].diff()
        gain     = delta.where(delta > 0, 0)
        loss     = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=period, min_periods=period).mean()
        avg_loss = loss.rolling(window=period, min_periods=period).mean()
        rs       = avg_gain / avg_loss
        self.df[f'RSI_{period}'] = (100 - (100 / (1 + rs))).round(2)
        self.df[f'RSI_{period}'] = self.df[f'RSI_{period}'].replace({np.nan: None})

    def ATR(self, period: int = 14):
        high_low    = self.df['high'] - self.df['low']
        high_close  = (self.df['high'] - self.df['close'].shift()).abs()
        low_close   = (self.df['low'] - self.df['close'].shift()).abs()
        tr          = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
        self.df[f'ATR_{period}'] = tr.rolling(window=period, min_periods=period).mean().round(2)
        self.df[f'ATR_{period}'] = self.df[f'ATR_{period}'].replace({np.nan: None})

    def EMA(self, period: int = 14):
        self.df[f'EMA_{period}'] = self.df['close'].ewm(span=period, adjust=False).mean().replace({np.nan: None})

    def MACD(self, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9):
        ema_fast = self.df['close'].ewm(span=fast_period, adjust=False).mean()
        ema_slow = self.df['close'].ewm(span=slow_period, adjust=False).mean()
        macd = ema_fast - ema_slow
        signal = macd.ewm(span=signal_period, adjust=False).mean()

        self.df['MACD'] = macd
        self.df['MACD_signal'] = signal
        self.df['MACD_hist'] = macd - signal
    
    def RETURNS(self):
        self.df["returns"] = self.df["close"].pct_change()
        self.df["returns"] = pd.to_numeric(self.df["returns"])
        self.df["returns"] = self.df["returns"].round(5)
        self.df["returns"] = self.df["returns"].replace({np.nan: None})
    
    def VOLATILITY(self, period: int = 14):
        self.df['volatility']  =  self.df['close'].pct_change().rolling(period).std()
        self.df["volatility"]  = self.df["volatility"].round(5).replace({np.nan: None})

    def getDf(self):
        return setHistoricalDFColTypes(self.df)
    