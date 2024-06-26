import { isDevMode } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import * as bcrypt from 'bcryptjs';
import * as CryptoJs from 'crypto-js';
export const DOMAIN = 'Susangam';
import { environment } from 'src/environments/environment';
export const getSalt = (length: number) => {
    return bcrypt.genSaltSync(length);
}

export let HASH_STRING = '';
export const SECRET_KEY = 'JPM7Fg';
export const MERCHANT_KEY_TEST = 'B15aom';
export const MERCHANT_KEY_LIVE = 'WA6Kpg';
export let SALT_KEY_TEST = 'XDbX0tFwbufYsXjSrVWjxTgaB64RVnB3';
export let SALT_KEY_LIVE = 'X4Y3GsJwPYB8OM34PrgIah1n0K8zYI2P';
export let PAYMENT_OBJECT: any = {};


export const COLOR_SCHEME = 'br';

const redButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

const boButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-bo-500 hover:bg-bo-600 focus:ring-4 focus:outline-none focus:ring-bo-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

const brButton = `flex item-center justify-start disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 text-white bg-br-500 hover:bg-br-600 focus:ring-4 focus:outline-none focus:ring-br-300 font-medium rounded-lg text-sm text-center items-center justify-start gap-2 me-2 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:dark:bg-gray-800 disabled:dark:opacity-70 disabled:dark:shadow-none disabled:bg-gray-300 disabled:opacity-70 disabled:shadow-none disabled:hover:bg-gray-300 dark:focus:ring-gray-400`;

export const dashboardCards: any = {
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
    red: {
        sm: redButton + ' px-2 py-1',
        md: redButton + ' px-3 py-2',
        lg: redButton + ' px-5 py-2.5'
    },
    bo: {
        sm: boButton + ' px-2 py-1',
        md: boButton + ' px-3 py-2',
        lg: boButton + ' px-5 py-2.5'
    },
    br: {
        sm: brButton + ' px-2 py-1',
        md: brButton + ' px-3 py-2',
        lg: brButton + ' px-5 py-2.5'
    }
}

export const iconSize = {
    small: 'text-sm',
    default: 'text-xl',
    large: 'text-2xl'
}

export const inputThemeVariables: any = {
    red: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500`,
    bo: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-bo-600 focus:border-bo-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-bo-500 dark:focus:border-bo-500`,
    br: `bg-gray-50 border border-gray-300 text-gray-900 border-solid text-sm rounded-lg focus:ring-br-600 focus:border-br-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-br-500 dark:focus:border-br-500`
}

export const dropdownThemeVariables: any = {
    red: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
    `,
    bo: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-bo-300 focus:border-red-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
    `,
    br: `
    text-gray-900 bg-gray-50 border !border-gray-300 focus:ring-br-300 focus:border-red-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
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
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `bg-green-200`,
        }
    },
    red: {
        line: {
            active: `flex w-full items-center text-red-600 dark:text-red-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-red-100 after:border-4 after:inline-block dark:after:border-red-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-100 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-red-300 rounded-full lg:h-12 lg:w-12 dark:bg-red-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    bo: {
        line: {
            active: `flex w-full items-center text-bo-600 dark:text-bo-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-bo-300 after:border-4 after:inline-block dark:after:border-bo-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-300 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-bo-300 rounded-full lg:h-12 lg:w-12 dark:bg-bo-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    },
    br: {
        line: {
            active: `flex w-full items-center text-br-600 dark:text-br-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-br-300 after:border-4 after:inline-block dark:after:border-br-800`,
            inactive: `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block dark:after:border-gray-800`,
            complete: `flex w-full items-center text-green-700 dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-300 after:border-4 after:inline-block dark:after:border-green-800`
        },
        bg: {
            active: `flex items-center justify-center w-10 h-10 bg-br-300 rounded-full lg:h-12 lg:w-12 dark:bg-br-800 shrink-0`,
            inactive: `flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`,
            complete: `flex items-center justify-center w-10 h-10 bg-green-300 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0`
        }
    }
}


export const convertObjectToJson = (obj: any) => {

}

export const AUTO_DISMISS_TIMER: number = 4500;

export const getRandomNumber = (src: string): string => {
    const max = 100;
    const min = 1;
    return `${src}-${Math.floor(Math.random() * (max - min + 1)) + min}`;
}

export const findInvalidControlsRecursive = (formToInvestigate: FormGroup | FormArray): string[] => {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
        Object.keys(form.controls).forEach(field => {
            const control: any = form.get(field);
            if (control.invalid) invalidControls.push(field);
            if (control instanceof FormGroup) {
                recursiveFunc(control);
            } else if (control instanceof FormArray) {
                recursiveFunc(control);
            }
        });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
}

export const nestedRoutes = ['users', 'customers', 'branch', 'events', 'blog', '/users/add', '/customers/add', '/branch/add', '/events/add', '/events/edit', '/branch/edit', '/users/edit', '/blog/add', '/blog/edit', 'master'];

export const TITHI_LIST = [
    { title: 'Gotra', value: '' },
    { title: 'Raas', value: '' },
    { title: 'Nakshatra', value: '' },
    { title: 'Charan', value: '' },
    { title: 'Nadi', value: '' },
    { title: 'Gana', value: '' }
];

export enum StepPath {
    PERSONAL = 'personal',
    FAMILY = 'family',
    CONTACT = 'contact',
    OTHER = 'other',
    PHOTOS = 'photos',
    PAYMENT = 'payment'
}

export function setPaymentObject(payment: Payment) {
    const paymentResponse = `${window.location.href}response`;
    const { txnid, amount, productinfo, email, firstname, lastname, phone } = payment;
    genertateHash({ txnid, amount, productinfo, firstname, email, phone });
    PAYMENT_OBJECT = payment;
    PAYMENT_OBJECT['hash'] = HASH_STRING;
}


export const paymentHtmlPayload = (payment: Payment, appEnv: string) => {
    const paymentResponse = `http://localhost:4200/payment`;
    // const paymentResponse = `https://8d45-106-51-37-15.ngrok-free.app/payment/payu-confirm/RMAXZ4/`;
    const { txnid, amount, productinfo, email, firstname, phone, surl, furl, hash } = payment;
    const merchantKey = appEnv === 'local' ? MERCHANT_KEY_TEST : MERCHANT_KEY_LIVE;
    const actionUrl  = appEnv === 'local' ? environment.paymentTestingUrl : environment.paymentProdingUrl;
    // key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash
    const htmlBody = `
    <html>
    <body>
    <form action='${actionUrl}' method="POST" id="payu_form">
    <input type="hidden" name="key" value="${merchantKey}" />
    <input type="hidden" name="txnid" value="${txnid}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="productinfo" value="${productinfo}" />
    <input type="hidden" name="firstname" value="${firstname}" />
    <input type="hidden" name="email" value="${email}" />
    <input type="hidden" name="phone" value="${phone}” />
    <input type="hidden" name="furl" value="${furl}" />
    <input type="hidden" name="surl" value="${surl}" />
    <input type="hidden" name="udf1" value="data1" />
    <input type="hidden" name="udf2" value="data2" />
    <input type="hidden" name="udf3" value="data3" />
    <input type="hidden" name="udf4" value="data4" />
    <input type="hidden" name="udf5" value="data5" />
    <input type="hidden" name="hash" value="${hash}" />
    </form>
    <p>Redirecting....</p>
    <script type="text/javascript">
            document.getElementById("payu_form").submit();
    </script>
    </body>
    </html>
    `;

    return htmlBody;
}

const genertateHash = ({ txnid, amount, productinfo, firstname, email, phone }: { txnid: string, amount: string, productinfo: string, firstname: string, email: string, phone: string }) => {
    const appEnv = isDevMode() ? 'local' : 'prod';
    const merchantKey = appEnv === 'local' ? MERCHANT_KEY_TEST : MERCHANT_KEY_LIVE;
    const saltKey = appEnv === 'local' ? SALT_KEY_TEST : SALT_KEY_LIVE;
    const hashInput = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${saltKey}`;
    console.log('hashInput: ', hashInput);
    HASH_STRING = CryptoJs.SHA512(hashInput).toString();
}

export function verifyPaymentHash({ command, txnid }: { command: string, txnid: string }): string {
    const appEnv = isDevMode() ? 'local' : 'prod';
    const merchantKey = appEnv === 'local' ? MERCHANT_KEY_TEST : MERCHANT_KEY_LIVE;
    const saltKey = appEnv === 'local' ? SALT_KEY_TEST : SALT_KEY_LIVE;
    const hashInput = merchantKey + "|" + command + "|" + txnid + "|" + saltKey;

    const hashStringHex = CryptoJs.SHA512(hashInput).toString(CryptoJs.enc.Hex);

    return hashStringHex;
}

export const generateTxnId = (firstName?: string, email?: string) => {
    const timestamp = Date.now();
    const combinedString = `${generateSecureRandomString(16)}${generateRandomEmailWithUUID()}${timestamp}`;
    const hashString = CryptoJs.SHA512(combinedString).toString();
    // const uniqueId = hashString ? hashString.substring(0, 15) : '';
    const uniqueId = hashString ? 'TXN' + hashString.replace(/\D/g, '').substring(0, 16) : '';
    return uniqueId;
}

const generateSecureRandomString = (length: number) => {
    const randomBytes = CryptoJs.lib.WordArray.random(length);
    const convertedRandomBytes = randomBytes.toString(CryptoJs.enc.Hex);
    return convertedRandomBytes;
}

function generateUUID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateRandomEmailWithUUID() {
    const username = generateUUID();
    const domain = DOMAIN + '.com';
    return `${username}@${domain}`;
}


export interface Payment {
    txnid: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    lastname?: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
}

export class PaymentProvider {
    key: string;
    txnId: string;
    productinfo: string;
    amount: string;
    email: string;
    firstname: string;
    phone: string;
    hash: string;

    constructor(
        key: string = MERCHANT_KEY_TEST,
        txnId: string,
        productinfo: string,
        amount: string,
        email: string,
        firstname: string,
        phone: string,
        hash: string = HASH_STRING
    ) {
        this.key = key;
        this.txnId = txnId;
        this.productinfo = productinfo;
        this.amount = amount;
        this.email = email;
        this.firstname = firstname;
        this.phone = phone;
        this.hash = hash;
    }
}