"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmailConfirmed = exports.EmailResendingDecorator = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../../../entities/users/users.repository");
let EmailResendingDecorator = class EmailResendingDecorator {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async validate(email, args) {
        const user = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user)
            return false;
        const confirmation = await this.usersRepository.findConfirmation(user.id.toString());
        if (confirmation === true) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `user with provided email does not exist or already confirmed`;
    }
};
EmailResendingDecorator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isEmailConfirmed', async: true }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], EmailResendingDecorator);
exports.EmailResendingDecorator = EmailResendingDecorator;
function IsEmailConfirmed(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'IsLoginOrEmailExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: EmailResendingDecorator,
        });
    };
}
exports.IsEmailConfirmed = IsEmailConfirmed;
//# sourceMappingURL=email-resending.decorator.js.map