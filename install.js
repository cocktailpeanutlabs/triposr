const config = require("./config.js")
const pre = require("./pre.js")
module.exports = async (kernel) => {
  let torch = pre(config, kernel)
  let env = {}
  if (kernel.gpu === 'nvidia') {
    env.CUDA_HOME = "{{path.resolve(cwd, 'app/env')}}"
  }
  let script = {
    run: [{
      method: "shell.run",
      params: {
        message: "git clone https://huggingface.co/spaces/cocktailpeanut/TripoSR app",
      }
    }, {
      method: "shell.run",
      params: {
        conda: "env",
        path: "app",
        env,
        message: (() => {
          if (kernel.platform === 'darwin') {
            return [
              torch,
              'conda install -y nomkl',
              'pip install -r requirements.txt'
            ]
          } else if (kernel.gpu === 'nvidia') {
             return [
              torch,
              'conda install -y nvidia/label/cuda-11.8.0::cuda',
              'pip install -r requirements.txt',
              'conda remove -y nvidia/label/cuda-11.8.0::cuda'
            ]
          } else {
            return [
              torch,
              'pip install -r requirements.txt'
            ]
          }
        })()
      }
    }, {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!"
      }
    }]
  }
  return script
}
