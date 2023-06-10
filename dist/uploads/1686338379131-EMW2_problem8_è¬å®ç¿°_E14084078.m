clc;
clear all;

%% parameter setting

G = 1e9; %GHz
c = 3e8;                    % Wave propagation speed.
f = linspace(1*G,3*G,1e4);  % Set frequency range from 1GHz to 3GHz
wave_lenth = c/(2*G);       % wave length

%% Possible solution.

solution1 = cal_Gammma(0.2594*wave_lenth , 0.405*wave_lenth,f);
solution2 = cal_Gammma(0.11*wave_lenth , 0.0962*wave_lenth,f);

%% Figure1. Draw out two computation results.

figure(1);
hold on;
grid on;
plot(f,solution1,'g-','LineWidth',1.8,'DisplayName','Solution1');
plot(f,solution2,'b--','LineWidth',1.8,'DisplayName','Solution2');
legend('Location','SouthWest');
axis([min(f) max(f) 0 1]);
xlabel('f(Hz)');
ylabel('Gamma');
title('Gamma for solution1 and solution2');

%% Figure2. Calculate the bandwidth of the result.

bandwidth1 = cal_bandwidth(solution1,f);
bandwidth2 = cal_bandwidth(solution2,f);

%% Function declartion.
function gamma = cal_Gammma(d,l,freq)

    Z0 = 50;
    wave_length = 3e8./freq;
    beta = 2*pi()./wave_length;             
    
    c = 0.995*1e-12;                        
    Z_c = (1i*(2*pi()*freq)*c).^-1;         %Impedance of capacitor.
    
    ZL = Z_c + 60;                          %Total load impedance.
    
    %Input impedance as seen looking towards the load from the location of the single-stub
    Z_1 = Z0.*((ZL + 1i*Z0.*tan(beta.*d))./(Z0 + 1i*ZL.*tan(beta.*d)));

    %Change to admittance.
    Y_1 = Z_1.^-1;
    
    %Input impedance of single-stub.
    Z_sc = 1i*Z0*tan(beta.*l);

    %Change to admittance.
    Y_sc = Z_sc.^-1;
    
    % Total admittance 
    Y_in = Y_1 + Y_sc;
    
    % Change to impedance.
    Z_in = Y_in.^-1;
    
    %Calculate the amplitude of reflection coefficient.
    gamma = abs((Z_in-Z0)./(Z_in+Z0));

end

function bandwidth = cal_bandwidth(solution,f)
    a = 1;
    while(solution(a) > 0.2)
        a = a + 1;
    end
  
    b = length(solution);
    while(solution(b) > 0.2)
        b = b - 1;
    end

    bandwidth = f(b) - f(a); % calculate bandwidth
end
