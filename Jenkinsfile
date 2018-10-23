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

  // always stage branches (including master) to preview bucket path
  stage('Deploy current branch') {
    newImage.inside {
      sh """
        cd /src
        npm run --silent stage-with-jenkins
      """
    }
  }

  // deploy master branch changes to www.zooniverse.org
  stage('Deploy production') {
    if (BRANCH_NAME == 'master') {
      newImage.inside {
        sh """
          cd /src
          npm run --silent deploy
        """
      }
    }
  }
}
