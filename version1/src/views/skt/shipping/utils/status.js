export const colorStatusWithId = id => {
  switch (id) {
  case 200:
    return { color: 'grey', message: 'orange-darken-1', text: 'Cancel', bgColor: '#E0E0E0' }
  case 201:
    return { color: 'deep-orange', message: 'green', text: 'ETL Failed!', bgColor: '#EF9A9A' }
  case 202:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Shipping', bgColor: '#FCE4EC' }
  case 203:
    return { color: 'amber', message: 'purple', text: 'Draft Shipping', bgColor: '#FFC107' }

  case 302:
    return { color: 'pink', message: 'brown', text: 'Waiting for SAL Draft', bgColor: '#EFEBE9' }
  case 303:
    return { color: 'amber', message: 'green', text: 'SAL Draft Shipping', bgColor: '#E8F5E9' }
  case 304:
    return { color: 'teal', message: 'red', text: 'SAL Submitted', bgColor: '#FFEBEE' }

  case 402:
    return { color: 'pink', message: 'red', text: 'Waiting for WH Draft', bgColor: '#FFEBEE' }
  case 403:
    return { color: 'amber', message: 'red', text: 'WH Draft Shipping', bgColor: '#FFEBEE' }
  case 404:
    return { color: 'teal', message: 'red', text: 'WH Submitted', bgColor: '#FFEBEE' }

  case 502:
    return { color: 'pink', message: 'red', text: 'Waiting FOR LOG Draft', bgColor: '#FFEBEE' }
  case 503:
    return { color: 'amber', message: 'red', text: 'LOG Draft Shipping', bgColor: '#FFEBEE' }
  case 504:
    return { color: 'teal', message: 'red', text: 'LOG Submitted', bgColor: '#FFEBEE' }

  case 602:
    return { color: 'pink', message: 'red', text: 'Waiting FOR INSP Draft', bgColor: '#FFEBEE' }
  case 603:
    return { color: 'amber', message: 'red', text: 'INSP Draft Shipping', bgColor: '#FFEBEE' }
  case 604:
    return { color: 'teal', message: 'red', text: 'INSP Submitted', bgColor: '#FFEBEE' }

  case 1002:
    return { color: 'pink', message: 'red', text: 'Waiting for CS Draft', bgColor: '#FFEBEE' }
  case 1003:
    return { color: 'amber', message: 'red', text: 'CS1 Draft Shipping', bgColor: '#FFEBEE' }
  case 1004:
    return { color: 'amber', message: 'red', text: 'CS2 Draft Shipping', bgColor: '#FFEBEE' }
  case 1005:
    return { color: 'teal', message: 'red', text: 'CS Submitted', bgColor: '#FFEBEE' }

  case 1102:
    return { color: 'pink', message: 'red', text: 'Waiting for Draft', bgColor: '#FFEBEE' }
  case 1103:
    return { color: 'amber', message: 'red', text: 'Draft Shipping LF', bgColor: '#FFEBEE' }
  case 1104:
    return { color: 'amber', message: 'red', text: 'Waiting for Lorry/Flex APVL', bgColor: '#FFEBEE' }
  case 1105:
    return { color: 'teal', message: 'red', text: 'Lorry/Flex Submitted', bgColor: '#FFEBEE' }

  case 204:
    return { color: 'pink', message: 'red', text: 'In Submitting (SWL )', bgColor: '#FFEBEE' }
  case 205:
    return { color: 'brown', message: 'red', text: 'Waiting for WH APVL', bgColor: '#FFEBEE' }
  case 206:
    return { color: 'red', message: 'red', text: 'Shipping Rejected', bgColor: '#FFEBEE' }
  case 207:
    return { color: 'green', message: 'red', text: 'Shipping Completed', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: '', bgColor: '#FFF3E0' }
  }
}
