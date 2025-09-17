import axios from "axios";

export class TestRail {
  TESTRAIL_URL: string;
  USERNAME: string;
  API_KEY: string;

  constructor() {
    this.TESTRAIL_URL = process.env.TR_URL;
    this.USERNAME = process.env.TR_USERNAME;
    this.API_KEY = process.env.TR_PASSWORD;
  }

  async getProjects(projectname) {
    try {
      const response = await axios.get(
        `${this.TESTRAIL_URL}/index.php?/api/v2/get_projects`,
        {
          auth: {
            username: this.USERNAME,
            password: this.API_KEY,
          },
        }
      );
      const project = response.data.projects.find((p: any) => p.name === projectname);
      return project ? project.id : null;
    //   return response.data;
    } catch (error: any) {
      console.error("Error fetching projects:", error.response?.data || error.message);
      throw error;
    }
  }

  async getCaseID(projectid,casename) {
    try {
      const response = await axios.get(
        `${this.TESTRAIL_URL}/index.php?/api/v2/get_cases/${projectid}`,
        {
          auth: {
            username: this.USERNAME,
            password: this.API_KEY,
          },
        }
      );
      const caseinfo = response.data.cases.find((p: any) => p.title === casename);
      return caseinfo ? caseinfo.id : null;
    //   return response.data;
    } catch (error: any) {
      console.error("Error fetching projects:", error.response?.data || error.message);
      throw error;
    }
  }

  async addRun(projectId: number, runName: string, description: string, caseIds?: number[]) {
    try {
      const body: any = {
        name: runName,
        description: description,
        include_all: caseIds ? false : true, // if no caseIds passed, include all
      };
  
      if (caseIds) {
        body.case_ids = caseIds; // restrict run to specific test cases
      }
  
      const response = await axios.post(
        `${this.TESTRAIL_URL}/index.php?/api/v2/add_run/${projectId}`,
        body,
        {
          auth: {
            username: this.USERNAME,
            password: this.API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ Run created:", response.data);
      return response.data; // contains run id and details
    } catch (error: any) {
      console.error(
        "❌ Error creating run:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
  
  async getRuns(projectId: number) {
    try {
      const response = await axios.get(
        `${this.TESTRAIL_URL}/index.php?/api/v2/get_runs/${projectId}`,
        {
          auth: {
            username: this.USERNAME,
            password: this.API_KEY,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching runs:", error.response?.data || error.message);
      throw error;
    }
  }

  async addResult(runId: number, caseId: number, statusId: number, comment: string) {
    try {
    // const resultid = statusId === 200 ? 1 : 2;
      const response = await axios.post(
        `${this.TESTRAIL_URL}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
        {
          status_id: statusId,
          comment,
        },
        {
          auth: {
            username: this.USERNAME,
            password: this.API_KEY,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding result:", error.response?.data || error.message);
      throw error;
    }
  }
}
