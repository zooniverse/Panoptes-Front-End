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
    newImage.inside {
      sh """
        cd /src
        npm run --silent stage-with-jenkins
      """
    }
  }
}
