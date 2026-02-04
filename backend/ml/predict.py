import pickle
from pathlib import Path
import pandas as pd
from prophet import Prophet


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "agmarknet_sample.csv"
MODEL_DIR = Path(__file__).resolve().parent / "models"


def load_or_train(crop: str, region: str) -> Prophet:
    file_name = f"{crop.lower()}_{region.lower()}.pkl"
    model_path = MODEL_DIR / file_name
    if model_path.exists():
        with open(model_path, "rb") as handle:
            return pickle.load(handle)

    df = pd.read_csv(DATA_PATH, parse_dates=["date"])
    group = df[(df["crop"] == crop) & (df["region"] == region)]
    model = Prophet()
    model.add_regressor("rainfall")
    model.add_regressor("temperature")
    train_df = group.rename(columns={"date": "ds", "price": "y"})[
        ["ds", "y", "rainfall", "temperature"]
    ]
    model.fit(train_df)
    return model


def predict_prices(crop: str, region: str, periods: int = 30):
    df = pd.read_csv(DATA_PATH, parse_dates=["date"])
    group = df[(df["crop"] == crop) & (df["region"] == region)]
    model = load_or_train(crop, region)
    future = model.make_future_dataframe(periods=periods, freq="D")
    future = future.merge(
        group[["date", "rainfall", "temperature"]].rename(columns={"date": "ds"}),
        on="ds",
        how="left",
    )
    future["rainfall"] = future["rainfall"].fillna(group["rainfall"].mean())
    future["temperature"] = future["temperature"].fillna(group["temperature"].mean())
    forecast = model.predict(future)
    return forecast.tail(periods)[["ds", "yhat", "yhat_lower", "yhat_upper"]]


if __name__ == "__main__":
    output = predict_prices("Tomato", "Nagpur")
    print(output.head())
