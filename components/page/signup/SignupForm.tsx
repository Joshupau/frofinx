'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, Home, MapPin, Globe, CheckCircle2, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RegisterFormData, registerSchema } from '@/validation/auth'
import { useRegisterUser } from '@/queries/auth/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'



export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [fileName, setFileName] = useState('')

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: undefined,
      phonenumber: undefined,
      firstname: undefined,
      lastname: undefined,
      address: undefined,
      city: undefined,
      country: undefined,
      postalcode: undefined,
    },
  })

  const { mutateAsync: registerUser, isPending } = useRegisterUser()

  const passwordValue = watch('password') || ''
  const confirmPasswordValue = watch('confirmPassword') || ''

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(passwordValue))
  }, [passwordValue])

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   setFileName(file.name)
  //   const reader = new FileReader()
  //   reader.onloadend = () => {
  //     if (typeof reader.result === 'string') {
  //       setValue('profilepicture', reader.result, { shouldValidate: true })
  //     }
  //   }
  //   reader.readAsDataURL(file)
  // }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Fair'
    return 'Strong'
  }

  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ['email', 'username', 'password', 'confirmPassword'],
    2: ['firstname', 'lastname', 'phonenumber'],
    3: ['address', 'city', 'country', 'postalcode'],
    4: [],
  }

  const handleNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep]
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true })

    if (!isValid) return

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    if (currentStep < 4) {
      await handleNextStep()
      return
    }

    registerUser(data, {
      onSuccess: () => {
        toast.success('Account created successfully! Please sign in.')
        reset()
        setCurrentStep(1)
        setFileName('')
        setPasswordStrength(0)
        setShowPassword(false)
      }
    })
  }

  const progressPercentage = (currentStep / 4) * 100
  const isSaving = isSubmitting || isPending

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-lg transition-all duration-300">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border">
              <Image src="/FroFinXLogoTrans.png" alt="FroFinX logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="ml-2 font-bold text-xl text-foreground">FroFinX</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground text-sm">Fill in the details to get started</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-all duration-300 ${
                  step < currentStep ? 'bg-emerald-500 text-white' :
                  step === currentStep ? 'bg-blue-600 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                <span className="text-xs text-muted-foreground text-center">
                  {step === 1 ? 'Account' : step === 2 ? 'Personal' : step === 3 ? 'Address' : 'Confirm'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && currentStep !== 4) {
              e.preventDefault()
              void handleNextStep()
            }
          }}
          className="space-y-4"
        >
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('email', {
                      setValueAs: value => value?.trim() ? value.trim().toLowerCase() : undefined,
                    })}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('username', {
                      setValueAs: value => value?.trim(),
                    })}
                  />
                </div>
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('password', {
                      setValueAs: value => value?.trim(),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                {passwordValue && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full w-full transition-all ${getPasswordStrengthColor()}`} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{getPasswordStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('confirmPassword', {
                      setValueAs: value => value?.trim() || undefined,
                    })}
                  />
                  {confirmPasswordValue && passwordValue === confirmPasswordValue && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  )}
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="text-sm font-medium text-foreground block">First name</label>
                  <input
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('firstname', {
                      setValueAs: value => value?.trim() || undefined,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastname" className="text-sm font-medium text-foreground block">Last name</label>
                  <input
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('lastname', {
                      setValueAs: value => value?.trim() || undefined,
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phonenumber" className="text-sm font-medium text-foreground block">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="phonenumber"
                    type="tel"
                    placeholder="Phone number"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('phonenumber', {
                      setValueAs: value => {
                        const trimmed = value?.trim()
                        return trimmed ? trimmed : undefined
                      },
                    })}
                  />
                </div>
                {errors.phonenumber && <p className="text-sm text-red-500">{errors.phonenumber.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground block">Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    id="address"
                    type="text"
                    placeholder="Street address"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('address', {
                      setValueAs: value => value?.trim() || undefined,
                    })}
                  />
                </div>
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-foreground block">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      id="city"
                      type="text"
                      placeholder="City"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...register('city', {
                        setValueAs: value => value?.trim() || undefined,
                      })}
                    />
                  </div>
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium text-foreground block">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      id="country"
                      type="text"
                      placeholder="Country"
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...register('country', {
                        setValueAs: value => value?.trim() || undefined,
                      })}
                    />
                  </div>
                  {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalcode" className="text-sm font-medium text-foreground block">Postal code</label>
                  <input
                    id="postalcode"
                    type="text"
                    placeholder="Postal code"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('postalcode', {
                      setValueAs: value => value?.trim() || undefined,
                    })}
                  />
                  {errors.postalcode && <p className="text-sm text-red-500">{errors.postalcode.message}</p>}
                </div>
              </div>
              {/*            
              <div className="space-y-2">
                <label htmlFor="profilePicture" className="text-sm font-medium text-slate-900 dark:text-white block">Profile picture</label>
                <label htmlFor="profilePicture" className="block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center">
                  <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400 mx-auto mb-2" />
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{fileName || 'Choose file or drag and drop'}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">PNG, JPG up to 5MB</p>
                </label>
                {errors.profilepicture && <p className="text-sm text-red-500">{errors.profilepicture.message}</p>}
              </div> */}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold">Confirm your details</h2>
              <div className="space-y-3 text-sm text-foreground">
                {/* show a summary of watched values */}
                {(() => {
                  const vals = watch()
                  return (
                    <div className="grid grid-cols-1 gap-2">
                      <div><strong>Username:</strong> {vals.username || '-'}</div>
                      <div><strong>Email:</strong> {vals.email || '-'}</div>
                      <div><strong>First name:</strong> {vals.firstname || '-'}</div>
                      <div><strong>Last name:</strong> {vals.lastname || '-'}</div>
                      <div><strong>Phone:</strong> {vals.phonenumber || '-'}</div>
                      <div><strong>Address:</strong> {vals.address || '-'}</div>
                      <div><strong>City:</strong> {vals.city || '-'}</div>
                      <div><strong>Country:</strong> {vals.country || '-'}</div>
                      <div><strong>Postal code:</strong> {vals.postalcode || '-'}</div>
                    </div>
                  )
                })()}
              </div>
              <div className="pt-4">
                <Button type="button" onClick={() => setCurrentStep(1)} className="mr-3">Edit</Button>
                <span className="text-sm text-slate-500">If everything looks good, click Create account.</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={handlePrevious}
                className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors duration-200"
                disabled={isSaving}
              >
                Previous
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                if (currentStep === 4) {
                  void handleSubmit(onSubmit)()
                } else {
                  void handleNextStep()
                }
              }}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-60"
              disabled={isSaving}
            >
              {currentStep === 4 ? (isSaving ? 'Creating account...' : 'Create account') : 'Next'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm border-t border-border pt-6">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/signin" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
