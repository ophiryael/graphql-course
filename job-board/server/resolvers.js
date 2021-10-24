const db = require('./db');

const Query = {
  company: (_root, { id }) => db.companies.get(id),
  job: (_root, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list(),
};

const Mutation = {
  createJob: (_root, { companyId, title, description }) => {
    return db.jobs.create({ companyId, title, description });
  },
};

const Job = {
  company: (job) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

module.exports = { Query, Mutation, Job, Company };
