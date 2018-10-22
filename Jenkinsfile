#!groovy

node {
  checkout scm

  def dockerRepoName = 'zooniverse/panoptes-front-end'
  def dockerImageName = "${dockerRepoName}:${BRANCH_NAME}"
  def newImage = null

  stage('Build Docker image') {
    newImage = docker.build(dockerImageName)

    if (BRANCH_NAME == 'master') {
      stage('Update latest tag') {
        newImage.push('latest')
      }
    }
  }

  stage('Deploy current branch') {
    def deploy_cmd = 'stage-with-jenkins'

    if (BRANCH_NAME == 'master') {
      deploy_cmd = 'deploy'
    }

    newImage.inside("-e DEPLOY_CMD=${deploy_cmd}") {
      sh """
        cd /src
        npm run --silent "$DEPLOY_CMD"
      """
    }

  }
}
