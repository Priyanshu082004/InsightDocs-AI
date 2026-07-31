import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
    User,
    Mail,
    Lock
} from "lucide-react";

import Input from "../components/common/Input";

import SocialButton from "../components/auth/SocialButton";
function SignupPage() {
  return (
   <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

    <div className="grid min-h-[720px] grid-cols-[1.2fr_0.8fr]">

        <div className="p-14">

            <div className="mb-10">
                       <h1 className="font-display text-5xl leading-tight font-medium tracking-tight text-gray-900">
                      Create your{" "}
                     <span className="text-brand-600">
                         account
                     </span>
                       </h1>

                       <p className="mt-4 max-w-md text-base leading-7 text-gray-500">
                        Join InsightDocs AI and turn your documents into intelligence.
                         </p>
            </div>
            <div className="mt-10 space-y-4">
                  <SocialButton icon={<FcGoogle size={22} />}>
                     Continue with Google
                   </SocialButton>

                          <SocialButton icon={<FaGithub size={20} />}>
                  Continue with GitHub
                       </SocialButton>
            </div>

            <div className="my-8 flex items-center gap-4">
                      <div className="h-px flex-1 bg-gray-200" />

                         <span className="text-sm text-gray-400">
                                or
                         </span>

                         <div className="h-px flex-1 bg-gray-200" />
                         </div>
            </div>
                      <div className="space-y-5">

                             <div className="grid grid-cols-2 gap-4">

                                   <Input
                                  icon={User}
                                     placeholder="Full Name"
                                     />

                                    <Input
                                    icon={Mail}
                                      placeholder="Email Address"
                                    type="email"
                                        />

                             </div>

                          <Input
                               icon={Lock}
                                placeholder="Password"
                                   type="password"
                               />

                          <Input
                            icon={Lock}
                             placeholder="Confirm Password"
                                  type="password"
                                  />

                      </div>


        <div className="border-l border-gray-200 p-14">

            {/* Why Choose InsightDocs */}

        </div>

    </div>

</div>
  );
}

export default SignupPage;
