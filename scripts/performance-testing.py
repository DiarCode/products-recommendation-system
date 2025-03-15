import aiohttp
import asyncio
import time
import matplotlib.pyplot as plt
import numpy as np
import os

# Configuration
endpoint_url = "http://localhost:8080/api/v1/products/my-recommendations"  # Replace with actual endpoint URL
access_token = os.environ.get('access_token')
num_requests = 100
concurrent_requests = 10

# Set up the cookies with the access token
cookies = {'accessToken': access_token}

# Lists to store data for plotting
response_times = []
error_count = 0

async def fetch(session, index):
    global error_count
    start_time = time.time()
    try:
        async with session.get(endpoint_url, cookies=cookies) as response:
            response_time = time.time() - start_time
            response_times.append(response_time * 1000)  # Convert to milliseconds
            print(f"Request {index + 1}: {response_time * 1000:.2f} ms")  # Optional: Print response time
    except Exception as e:
        error_count += 1
        print(f"Error in request {index + 1}: {str(e)}")

async def perform_requests(concurrent_requests):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, i) for i in range(num_requests)]
        for i in range(0, len(tasks), concurrent_requests):
            await asyncio.gather(*tasks[i:i + concurrent_requests])

# Run the asynchronous test
asyncio.run(perform_requests(concurrent_requests))

# Data Analysis
response_times.sort()
average_time = np.mean(response_times)
min_time = np.min(response_times)
max_time = np.max(response_times)
p95 = np.percentile(response_times, 95)
p99 = np.percentile(response_times, 99)
error_rate = (error_count / num_requests) * 100

# Print Metrics
print(f"Average Response Time: {average_time:.2f} ms")
print(f"Min Response Time: {min_time:.2f} ms")
print(f"Max Response Time: {max_time:.2f} ms")
print(f"95th Percentile: {p95:.2f} ms")
print(f"99th Percentile: {p99:.2f} ms")
print(f"Error Rate: {error_rate:.2f}%")

# Plotting the results
plt.figure(figsize=(12, 8))
plt.plot(range(len(response_times)), response_times, label="Response Time (ms)", color="blue", marker="o", markersize=3, linestyle="-")
plt.axhline(y=average_time, color='green', linestyle='--', label=f"Average Response Time ({average_time:.2f} ms)")
plt.axhline(y=p95, color='orange', linestyle='--', label=f"95th Percentile ({p95:.2f} ms)")
plt.axhline(y=p99, color='red', linestyle='--', label=f"99th Percentile ({p99:.2f} ms)")
plt.axhline(y=min_time, color='purple', linestyle='--', label=f"Min Response Time ({min_time:.2f} ms)")
plt.axhline(y=max_time, color='brown', linestyle='--', label=f"Max Response Time ({max_time:.2f} ms)")

# Adding the error rate as a note below the graph
metrics_text = f"Error Rate: {error_rate:.2f}%"
plt.figtext(0.1, -0.1, metrics_text, wrap=True, horizontalalignment='left', fontsize=10)

# Graph labels and legend
plt.xlabel("Request Index")
plt.ylabel("Response Time (ms)")
plt.title("Performance Test of Recommendation Endpoint")
plt.legend(loc="upper left")  # Adjust legend location if needed
plt.grid(True)
plt.tight_layout(pad=3)  # Adjust layout to prevent clipping
plt.show()