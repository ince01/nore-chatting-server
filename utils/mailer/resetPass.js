exports.verifyEmail = (toEmailAdd) => {
  return {
    to: toEmailAdd,
    from: 'support@nore-chatting-app.vn',
    templateId: 'd-9ce8127fa1824c67b9dbab099e5d29d3',
    dynamic_template_data: {
      subject: 'Testing Templates',
      name: 'Some One',
      city: 'Denver',
    },
  }
}