import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { env } from '../config/env';
import { userRepository } from '../repositories/user.repository';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecret,
};

export const configurePassport = (passport: PassportStatic): void => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await userRepository.findById(payload.sub);
        if (!user) return done(null, false);

        return done(null, {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
