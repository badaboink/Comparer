# Use an official Python runtime as a parent image
FROM python:3.10

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /djangoProject

# Copy the requirements file into the container
COPY requirements.txt /djangoProject/

# Install any needed packages specified in requirements.txt
RUN pip install -q -r requirements.txt

# Install system libraries needed for pyodbc
RUN apt-get update && \
    apt-get install -y unixodbc-dev && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Expose port 8000
EXPOSE 8000

# Define environment variable
ENV NAME World

# Copy the current directory contents into the container at /app
COPY . /djangoProject/

# Run Gunicorn to start your Django application
CMD ["gunicorn", "djangoProject.wsgi:application", "--bind", "0.0.0.0:8000"]
