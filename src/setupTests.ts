import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// @ts-expect-error - игнорируем ошибку типизации, так как типы из util совместимы с глобальными
global.TextEncoder = TextEncoder;
// @ts-expect-error - игнорируем ошибку типизации, так как типы из util совместимы с глобальными
global.TextDecoder = TextDecoder; 