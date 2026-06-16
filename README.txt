Food Insights Portal - Static Website v3

How to test locally:
1. Extract the ZIP file.
2. Open index.html in your browser.
3. Click Start Demo, Explore, Alternatives and About.
4. The site works locally because the food data is included in foods-data.js.

How to publish on Azure Static Web Apps:
1. Create a GitHub repository, for example food-insights-portal.
2. Upload the extracted files into the root of the repository.
3. In Azure Portal, create a Static Web App.
4. Connect it to the GitHub repository and main branch.
5. Build settings:
   - App location: /
   - API location: leave blank
   - Output location: leave blank
6. Azure will create a public HTTPS URL.

Files included:
- index.html
- demo.html
- explore.html
- food.html
- alternatives.html
- about.html
- styles.css
- app.js
- foods-data.js

This version uses UK/global everyday foods and avoids collecting personal data.
