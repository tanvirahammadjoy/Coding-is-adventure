import threading
import time

import requests

urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
]


def fetch(url, results, index):
    response = requests.get(url)
    results[index] = response.status_code


def run_threaded():
    results = [None] * len(urls)
    threads = []
    start = time.perf_counter()

    for i, url in enumerate(urls):
        t = threading.Thread(target=fetch, args=(url, results, i))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"Threaded: {time.perf_counter() - start:.2f}s -> {results}")


run_threaded()
