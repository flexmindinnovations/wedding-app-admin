export const COLOR_SCHEME = 'br';

export const themeVariables: any = {
    red: `
    bg-red-500 hover:bg-red-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `,
    bo: `
    bg-bo-500 hover:bg-bo-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `,
    br: `
    bg-br-500 hover:bg-br-600 dark:bg-gray-500 dark:text-white shadow-md text-white border-none
    `
}

export const buttonThemeVariables: any = {
    red: `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-400`,
    bo: `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-bo-500 hover:bg-bo-600 focus:ring-4 focus:outline-none focus:ring-bo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-400`,
    br: `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-br-500 hover:bg-br-600 focus:ring-4 focus:outline-none focus:ring-br-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-400`
}

export const inputThemeVariables: any = {
    red: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500`,
    bo: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-bo-600 focus:border-bo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-bo-500 dark:focus:border-bo-500`,
    br: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-br-600 focus:border-br-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-br-500 dark:focus:border-br-500`
}

export const dropdownThemeVariables: any = {
    red: `
    text-gray-900 bg-gray-50 border border-gray-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-800
    `,
    bo: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-4 focus:outline-none focus:ring-bo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-bo-600 dark:hover:bg-bo-500 dark:focus:ring-bo-800
    `,
    br: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-4 focus:outline-none focus:ring-br-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-br-600 dark:hover:bg-br-500 dark:focus:ring-br-800
    `
}

export const stepperThemeVariables: any = {
    lastItem: {
        line: {
            active: `text-${COLOR_SCHEME}-600 dark:text-${COLOR_SCHEME}-500`,
            inactive: ``,
            complete: `text-green-300`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-${COLOR_SCHEME}-100 rounded-full lg:h-12 lg:w-12 dark:bg-${COLOR_SCHEME}-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
            complete: `bg-green-200`,
        }
    },
    red: {
        line: {
            active: `flex w-full items-center text-red-600 dark:text-red-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-red-100 after:border-4 after:inline-block dark:after:border-red-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700`,
            complete: `flex w-full items-center text-green-600 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-100 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-red-100 rounded-full lg:h-12 lg:w-12 dark:bg-red-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-100 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    bo: {
        line: {
            active: `flex w-full items-center text-bo-600 dark:text-bo-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-bo-100 after:border-4 after:inline-block dark:after:border-bo-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700`,
            complete: `flex w-full items-center text-green-600 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-100 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-bo-100 rounded-full lg:h-12 lg:w-12 dark:bg-bo-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-100 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    br: {
        line: {
            active: `flex w-full items-center text-br-600 dark:text-br-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-br-100 after:border-4 after:inline-block dark:after:border-br-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700`,
            complete: `flex w-full items-center text-green-600 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-100 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-br-100 rounded-full lg:h-12 lg:w-12 dark:bg-br-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-100 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    }
}