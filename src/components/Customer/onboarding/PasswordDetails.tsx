import React, { useState } from 'react'
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormData } from '../SignUpForm'
import { Eye, EyeOff } from 'lucide-react'
import { Label } from '@/components/ui/label'

type Props = {
    errors: FieldErrors<FormData>,
    register: UseFormRegister<FormData>,
    watch: UseFormWatch<FormData>,
}

const validateStrongPassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message: string } => {
    if (password.length < 8) {
        return { isValid: false, strength: 'weak', message: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const requirementsMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (requirementsMet === 4) {
        return { isValid: true, strength: 'strong', message: 'Strong password' };
    } else if (requirementsMet >= 3) {
        return { isValid: true, strength: 'medium', message: 'Medium strength password' };
    } else {
        return {
            isValid: false,
            strength: 'weak',
            message: 'Include uppercase, lowercase, numbers, and special characters'
        };
    }
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
    if (!password) return null;

    const validation = validateStrongPassword(password);

    const getStrengthColor = () => {
        switch (validation.strength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthText = () => {
        switch (validation.strength) {
            case 'weak': return 'Weak';
            case 'medium': return 'Medium';
            case 'strong': return 'Strong';
            default: return '';
        }
    };

    const getStrengthTextColor = () => {
        switch (validation.strength) {
            case 'weak': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'strong': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Strength:</span>
                <span className={`font-medium ${getStrengthTextColor()}`}>
                    {getStrengthText()}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{
                        width: validation.strength === 'weak' ? '33%' :
                            validation.strength === 'medium' ? '66%' : '100%'
                    }}
                />
            </div>
            <p className={`text-xs ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validation.message}
            </p>
        </div>
    );
};

const PasswordDetails = ({ errors, register, watch }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const passwordValue = watch("password")
    const passwordStrength = passwordValue ? validateStrongPassword(passwordValue) : null
    const isPasswordStrongEnough = passwordStrength && passwordStrength.strength !== 'weak'

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                            validate: {
                                strongPassword: (value) => {
                                    if (!value) return true
                                    const validation = validateStrongPassword(value)
                                    return validation.isValid || validation.message
                                }
                            }
                        })}
                        placeholder="Enter password"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-gray-700 focus:outline-none"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {passwordValue && (
                    <PasswordStrengthIndicator password={passwordValue} />
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="cPassword">
                    Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="cPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("cPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === watch("password") || "Password does not match",
                        })}
                        placeholder="Confirm password"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-gray-700 focus:outline-none"
                        onClick={toggleConfirmPasswordVisibility}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.cPassword && <p className="text-red-500 text-xs">{errors.cPassword.message}</p>}
            </div>

            <div className="bg-faded-accent/5 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-dark-gray mb-2">Password Requirements:</h4>
                <ul className="text-xs font-normal text-medium-gray space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• May include uppercase and lowercase letters</li>
                    <li>• May include numbers</li>
                    <li>• May include special characters (!@#$%^&* etc.)</li>
                </ul>
            </div>
        </div>
    )
}

export default PasswordDetails