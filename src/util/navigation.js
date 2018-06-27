
import { ROUTER } from '@const/'

export default {
  projectLink(project, extraPath) {

    return `${ROUTER.PROJECT.replace(":identifier", project.identifier)}${extraPath ? `/${extraPath}` : ''}`;
  }
}

