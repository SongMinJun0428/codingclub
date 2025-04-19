const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const FORM_NAME = "homework";
  const API_URL = "https://api.netlify.com/api/v1/forms";
  const TOKEN = process.env.NETLIFY_API_TOKEN;

  try {
    const formsRes = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    const forms = await formsRes.json();
    const form = forms.find(f => f.name === FORM_NAME);
    if (!form) throw new Error("폼을 찾을 수 없습니다.");

    const submissionsRes = await fetch(`${API_URL}/${form.id}/submissions`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};