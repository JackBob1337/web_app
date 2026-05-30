import logging

def setup_logging(level: int = logging.INFO) -> None:
    logger = logging.getLogger()
    logger.setLevel(level)

    if logger.handlers:
        return

    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    handler.setFormatter(formatter)

    logger.addHandler(handler)