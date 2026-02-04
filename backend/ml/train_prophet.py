import pickle
from pathlib import Path

import pandas as pd
from prophet import Prophet


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "agmarknet_sample.csv"
MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def train_models():
    df = pd.read_csv(DATA_PATH, parse_dates=["date"])

    # Note: In a real federated learning setup, each APMC or FPO would train
    # locally and only share model updates. For the hackathon MVP, we train
    # centrally to keep the pipeline simple and demo-ready.
    for (crop, region), group in df.groupby(["crop", "region"]):
        model = Prophet()
        model.add_regressor("rainfall")
        model.add_regressor("temperature")
        train_df = group.rename(columns={"date": "ds", "price": "y"})[
            ["ds", "y", "rainfall", "temperature"]
        ]
        model.fit(train_df)
        file_name = f"{crop.lower()}_{region.lower()}.pkl"
        with open(MODEL_DIR / file_name, "wb") as handle:
            pickle.dump(model, handle)
        print(f"Trained model: {file_name}")


if __name__ == "__main__":
    train_models()
