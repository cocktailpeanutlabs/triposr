const config = require("./config.js")
const pre = require("./pre.js")
module.exports = async (kernel) => {
  let script = {
    run: [{
      method: "shell.run",
      params: {
        message: [
          "git clone https://huggingface.co/spaces/cocktailpeanut/TripoSR app",
        ]
      }
    }, {
      method: "shell.run",
      params: {
        conda: "env",
        path: "app",
        message: (kernel.platform === 'darwin' ? [ "conda install -y nomkl", "pip install -r requirements.txt" ] : [ 'pip install -r requirements.txt' ])
      }
    }, {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!"
      }
    }]
  }
  let pre_command = pre(config, kernel)
  if (pre_command) {
    script.run[1].params.message = [pre_command].concat(script.run[1].params.message)
  }
  return script
}
