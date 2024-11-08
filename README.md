# Patlytic Takehome - Patent Infringement Check

Overview
This application allows users to check for potential patent infringement based on a company name and patent ID. It interacts with a preconfigured JSON file (patent.json and company_products.json) to search for matching information and return relevant results.

Steps to Use the Application
Visit the Website: Navigate to the application using the URL:
https://patlytictakehome.onrender.com/

Input Data:
Enter the Company Name and Patent ID in the input fields.
The company name and patent ID can be entered in lowercase or capitalized as both formats will work.
Make sure to input values that are relevant to the patent.json and company_products.json files provided with the application.

ReCaptcha:
Before submitting the form, ensure that you click on the ReCaptcha box to verify you are not a robot.
If ReCaptcha is not clicked, an error will appear in the Chrome developer tool console.

Submit the Form:
Click Submit to send your request.
After a few seconds, the results related to the entered company and patent will be populated on the page.

# -----------------------------------------------------------------------------------------------------------

Running with Docker
If you prefer to run the application locally using Docker, follow these steps:

Install Docker: Ensure Docker is installed on your machine.

Download image from: https://drive.google.com/file/d/1LaKOnVpKZGvWu_kt0GXgt-n1yzRDdi5X/view?usp=drive_link

Load the image into Docker:
sudo docker load < /path/to/palyticchallenge.tar
Replace /path/to/palyticchallenge.tar with the actual path to your .tar file.

Run the Docker Container: After loading the image, run it using the following command:
sudo docker run -p 3000:3000 palyticchallenge:tag
This will expose port 3000 for local access. You can now open a web browser and visit http://localhost:3000 to use the application.

Access the Application:

The application will be accessible on http://localhost:3000.
You can follow the same steps as above to enter the company name and patent ID to check for infringement.

# -----------------------------------------------------------------------------------------------------------

Troubleshooting

ReCaptcha Error:
If the ReCaptcha box is not selected, the application will not submit, and an error will appear in the Chrome developer console.

Docker Issues:
If you face issues while running Docker, ensure Docker is correctly installed and the user has permissions to access Docker. If you're still having issues, restart the Docker service:
sudo systemctl restart docker

License
This project is open-source and is provided under the MIT license.